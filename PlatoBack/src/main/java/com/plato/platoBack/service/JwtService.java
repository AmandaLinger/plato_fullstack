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
        try {
            long issuedAt = Instant.now().getEpochSecond();
            Map<String, Object> claims = Map.of(
                    "sub", usuario.getNome(),
                    "uid", usuario.getId(),
                    "rid", usuario.getRestaurante().getId(),
                    "iat", issuedAt,
                    "exp", issuedAt + expirationSeconds
            );
            String header = encode(HEADER.getBytes(StandardCharsets.UTF_8));
            String payload = encode(objectMapper.writeValueAsBytes(claims));
            String content = header + "." + payload;
            return content + "." + encode(sign(content));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível gerar o token de autenticação", exception);
        }
    }

    public Long obterUsuarioId(String authorizationHeader) {
        return getNumberClaim(authorizationHeader, "uid");
    }

    public Long obterRestauranteId(String authorizationHeader) {
        return getNumberClaim(authorizationHeader, "rid");
    }

    private Long getNumberClaim(String authorizationHeader, String claimName) {
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
            Number claim = (Number) claims.get(claimName);
            if (expiration == null || claim == null || expiration.longValue() <= Instant.now().getEpochSecond()) {
                throw unauthorized();
            }

            return claim.longValue();
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
