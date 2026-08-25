package com.plato.platoBack.service;

import com.plato.platoBack.dto.*;
import com.plato.platoBack.entity.RecoveryCode;
import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.enuns.NivelAcesso;
import com.plato.platoBack.repository.RecoveryCodeRepository;
import com.plato.platoBack.repository.UsuarioRepository;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TwoFactorService {
    private static final char[] RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();

    private final UsuarioRepository usuarioRepository;
    private final RecoveryCodeRepository recoveryCodeRepository;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final BCryptPasswordEncoder codeEncoder = new BCryptPasswordEncoder(12);

    public AuthLoginResponse login(Long restauranteId, String nome, String senha)
            throws org.apache.coyote.BadRequestException {
        Usuario usuario = usuarioService.autenticar(restauranteId, nome, senha);
        if (isRoot(usuario) && Boolean.TRUE.equals(usuario.getTwoFactorEnabled())) {
            return new TwoFactorRequiredResponse(true, jwtService.gerarTokenTemporario2FA(usuario));
        }
        return new LoginResponse(jwtService.gerarToken(usuario), PerfilResponse.from(usuario));
    }

    @Transactional
    public TwoFactorSetupResponse setup(Long usuarioId) {
        Usuario root = requireRoot(usuarioId);
        if (Boolean.TRUE.equals(root.getTwoFactorEnabled())) {
            throw conflict("O 2FA já está ativado");
        }
        String secret = new DefaultSecretGenerator().generate();
        root.setTwoFactorSecret(secret);
        usuarioRepository.save(root);
        String issuer = encodeUri("Plato");
        String account = encodeUri(root.getNome());
        String uri = "otpauth://totp/" + issuer + ":" + account
                + "?secret=" + secret + "&issuer=" + issuer + "&algorithm=SHA1&digits=6&period=30";
        return new TwoFactorSetupResponse(secret, uri);
    }

    @Transactional
    public TwoFactorEnableResponse enable(Long usuarioId, String code) {
        Usuario root = requireRoot(usuarioId);
        if (Boolean.TRUE.equals(root.getTwoFactorEnabled())) throw conflict("O 2FA já está ativado");
        if (root.getTwoFactorSecret() == null || root.getTwoFactorSecret().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Execute o setup do 2FA primeiro");
        }
        if (!validTotp(root.getTwoFactorSecret(), normalizeTotp(code))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código 2FA inválido");
        }

        List<String> plainCodes = new ArrayList<>(8);
        recoveryCodeRepository.deleteAllByUsuarioId(root.getId());
        for (int i = 0; i < 8; i++) {
            String plain = generateRecoveryCode();
            plainCodes.add(plain);
            recoveryCodeRepository.save(RecoveryCode.builder()
                    .usuario(root).codeHash(codeEncoder.encode(normalizeRecovery(plain))).build());
        }
        root.setTwoFactorEnabled(true);
        usuarioRepository.save(root);
        return new TwoFactorEnableResponse(true, List.copyOf(plainCodes));
    }

    @Transactional
    public LoginResponse verifyLogin(String tempToken, String code) {
        if (tempToken == null || tempToken.isBlank()) unauthorized("Token temporário obrigatório");
        Long usuarioId = jwtService.obterUsuarioIdTokenTemporario2FA(tempToken);
        Usuario root = requireRoot(usuarioId);
        if (!Boolean.TRUE.equals(root.getTwoFactorEnabled()) || root.getTwoFactorSecret() == null) {
            unauthorized("2FA não está ativado para esta conta");
        }

        boolean valid = false;
        String normalizedTotp = normalizeTotp(code);
        if (normalizedTotp != null) valid = validTotp(root.getTwoFactorSecret(), normalizedTotp);
        if (!valid) valid = consumeRecoveryCode(root.getId(), code);
        if (!valid) unauthorized("Código 2FA ou de recuperação inválido");

        return new LoginResponse(jwtService.gerarToken(root), PerfilResponse.from(root));
    }

    private boolean consumeRecoveryCode(Long usuarioId, String input) {
        String normalized = normalizeRecovery(input);
        if (normalized == null) return false;
        for (RecoveryCode recovery : recoveryCodeRepository.findUnusedForUpdate(usuarioId)) {
            if (codeEncoder.matches(normalized, recovery.getCodeHash())) {
                recovery.setUsed(true);
                recoveryCodeRepository.save(recovery);
                return true;
            }
        }
        return false;
    }

    private boolean validTotp(String secret, String code) {
        DefaultCodeVerifier verifier = new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
        verifier.setAllowedTimePeriodDiscrepancy(1);
        return verifier.isValidCode(secret, code);
    }

    private Usuario requireRoot(Long usuarioId) {
        Usuario usuario = usuarioRepository.findByIdAndRestauranteIsNullAndAtivoTrue(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta ROOT inválida"));
        if (!isRoot(usuario)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operação exclusiva do ROOT");
        return usuario;
    }

    private boolean isRoot(Usuario usuario) {
        return usuario.getAcesso() == NivelAcesso.ROOT && usuario.getRestaurante() == null;
    }

    private String generateRecoveryCode() {
        StringBuilder value = new StringBuilder(11);
        for (int i = 0; i < 10; i++) {
            if (i == 5) value.append('-');
            value.append(RECOVERY_ALPHABET[secureRandom.nextInt(RECOVERY_ALPHABET.length)]);
        }
        return value.toString();
    }

    private String normalizeTotp(String code) {
        if (code == null) return null;
        String value = code.trim();
        return value.matches("\\d{6}") ? value : null;
    }

    private String normalizeRecovery(String code) {
        if (code == null) return null;
        String value = code.replace("-", "").replace(" ", "").toUpperCase(Locale.ROOT);
        return value.matches("[A-Z2-9]{10}") ? value : null;
    }

    private String encodeUri(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private void unauthorized(String message) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, message);
    }
}
