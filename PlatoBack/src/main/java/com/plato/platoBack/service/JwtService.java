package com.plato.platoBack.service;

import com.plato.platoBack.entity.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;
import com.plato.platoBack.enuns.NivelAcesso;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class JwtService {
    private static final Base64.Encoder BASE64_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_DECODER = Base64.getUrlDecoder();
    private static final String HEADER = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;
    private static final long TWO_FACTOR_EXPIRATION_SECONDS = 300;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-seconds}") long expirationSeconds
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String gerarToken(Usuario usuario) {
        return gerarToken(usuario, "session", expirationSeconds);
    }

    public String gerarTokenTemporario2FA(Usuario usuario) {
        if (usuario.getAcesso() != NivelAcesso.ROOT) {
            throw new IllegalArgumentException("Token temporário de 2FA é exclusivo do ROOT");
        }
        return gerarToken(usuario, "2fa_pending", TWO_FACTOR_EXPIRATION_SECONDS);
    }

    private String gerarToken(Usuario usuario, String purpose, long durationSeconds) {
        try {
            long issuedAt = Instant.now().getEpochSecond();
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", usuario.getNome());
            claims.put("uid", usuario.getId());
            claims.put("acesso", usuario.getAcesso().name());
            claims.put("purpose", purpose);
            claims.put("iat", issuedAt);
            claims.put("exp", issuedAt + durationSeconds);
            if (usuario.getRestaurante() != null) claims.put("rid", usuario.getRestaurante().getId());
            String header = encode(HEADER.getBytes(StandardCharsets.UTF_8));
            String payload = encode(objectMapper.writeValueAsBytes(claims));
            String content = header + "." + payload;
            return content + "." + encode(sign(content));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível gerar o token de autenticação", exception);
        }
    }

    public Long obterUsuarioId(String authorizationHeader) {
        return getNumberClaim(requireSessionClaims(authorizationHeader), "uid");
    }

    public Long obterRestauranteId(String authorizationHeader) {
        return getNumberClaim(requireSessionClaims(authorizationHeader), "rid");
    }

    public NivelAcesso obterNivelAcesso(String authorizationHeader) {
        String value = getStringClaim(requireSessionClaims(authorizationHeader), "acesso");
        try {
            return NivelAcesso.valueOf(value);
        } catch (Exception exception) {
            throw unauthorized();
        }
    }

    public Long obterUsuarioIdTokenTemporario2FA(String token) {
        Map<String, Object> claims = getClaims("Bearer " + token);
        if (!"2fa_pending".equals(claims.get("purpose"))
                || !NivelAcesso.ROOT.name().equals(claims.get("acesso"))) {
            throw unauthorized();
        }
        return getNumberClaim(claims, "uid");
    }

    private Map<String, Object> requireSessionClaims(String authorizationHeader) {
        Map<String, Object> claims = getClaims(authorizationHeader);
        if (!"session".equals(claims.get("purpose"))) throw unauthorized();
        return claims;
    }

    private String getStringClaim(Map<String, Object> claims, String claimName) {
        Object value = claims.get(claimName);
        if (!(value instanceof String stringValue)) throw unauthorized();
        return stringValue;
    }

    private Long getNumberClaim(Map<String, Object> claims, String claimName) {
        Object value = claims.get(claimName);
        if (!(value instanceof Number number)) throw unauthorized();
        return number.longValue();
    }

    private Map<String, Object> getClaims(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw unauthorized();
        }

        try {
            String token = authorizationHeader.substring(7);
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw unauthorized();
            }

            String content = parts[0] + "." + parts[1];
            if (!MessageDigest.isEqual(sign(content), BASE64_DECODER.decode(parts[2]))) {
                throw unauthorized();
            }

            Map<String, Object> claims = objectMapper.readValue(
                    BASE64_DECODER.decode(parts[1]),
                    new TypeReference<>() { }
            );
            Number expiration = (Number) claims.get("exp");
            if (expiration == null || expiration.longValue() <= Instant.now().getEpochSecond()) {
                throw unauthorized();
            }

            return claims;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw unauthorized();
        }
    }

    private byte[] sign(String content) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(content.getBytes(StandardCharsets.UTF_8));
    }

    private String encode(byte[] value) {
        return BASE64_ENCODER.encodeToString(value);
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado");
    }
}
