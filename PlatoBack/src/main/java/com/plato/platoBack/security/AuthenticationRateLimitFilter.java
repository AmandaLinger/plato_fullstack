package com.plato.platoBack.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Protege as duas etapas do login contra força bruta por endereço IP.
 * Apenas respostas 401 consomem definitivamente uma tentativa. Uma etapa bem-sucedida
 * (200 ou 202) reinicia a sequência; erros de validação ou servidor não penalizam o cliente.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class AuthenticationRateLimitFilter extends OncePerRequestFilter {
    private static final int MAX_ATTEMPTS = 5;
    private static final Duration BLOCK_DURATION = Duration.ofMinutes(10);
    private static final String LOGIN_PATH = "/api/auth/login";
    private static final String VERIFY_2FA_PATH = "/api/auth/login/verify-2fa";

    private final Map<String, IpLimit> limits = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public AuthenticationRateLimitFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!HttpMethod.POST.matches(request.getMethod())) return true;
        String path = request.getRequestURI();
        return !LOGIN_PATH.equals(path) && !VERIFY_2FA_PATH.equals(path);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String ip = request.getRemoteAddr();
        IpLimit limit = limits.computeIfAbsent(ip, ignored -> new IpLimit());

        synchronized (limit) {
            if (limit.isBlocked()) {
                writeBlockedResponse(response, limit.retryAfterSeconds());
                return;
            }
            // Reserva antes de executar a requisição para impedir bypass com chamadas paralelas.
            if (!limit.bucket.tryConsume(1)) {
                limit.block();
                writeBlockedResponse(response, limit.retryAfterSeconds());
                return;
            }
        }

        filterChain.doFilter(request, response);

        synchronized (limit) {
            if (response.getStatus() == HttpStatus.UNAUTHORIZED.value()) {
                if (limit.bucket.getAvailableTokens() == 0) limit.block();
            } else if (response.getStatus() == HttpStatus.OK.value()
                    || response.getStatus() == HttpStatus.ACCEPTED.value()) {
                // Login ou primeira etapa válidos: deixa de ser uma sequência de falhas.
                limit.reset();
            } else {
                // 400/500 e outros erros não representam credenciais incorretas.
                limit.bucket.addTokens(1);
            }
        }
    }

    private void writeBlockedResponse(HttpServletResponse response, long retryAfterSeconds) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader(HttpHeaders.RETRY_AFTER, Long.toString(retryAfterSeconds));
        objectMapper.writeValue(response.getWriter(), Map.of(
                "error", "Too Many Requests",
                "message", "Limite de tentativas excedido. Tente novamente em 10 minutos."
        ));
    }

    private static Bucket newBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(MAX_ATTEMPTS, Refill.intervally(MAX_ATTEMPTS, BLOCK_DURATION)))
                .build();
    }

    private static final class IpLimit {
        private Bucket bucket = newBucket();
        private Instant blockedUntil;

        private boolean isBlocked() {
            if (blockedUntil == null) return false;
            if (Instant.now().isBefore(blockedUntil)) return true;
            reset();
            return false;
        }

        private void block() {
            if (blockedUntil == null) blockedUntil = Instant.now().plus(BLOCK_DURATION);
        }

        private void reset() {
            bucket = newBucket();
            blockedUntil = null;
        }

        private long retryAfterSeconds() {
            if (blockedUntil == null) return BLOCK_DURATION.toSeconds();
            return Math.max(1, Duration.between(Instant.now(), blockedUntil).toSeconds() + 1);
        }
    }
}
