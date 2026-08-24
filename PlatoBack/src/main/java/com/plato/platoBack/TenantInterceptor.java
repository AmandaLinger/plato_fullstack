package com.plato.platoBack;

import com.plato.platoBack.service.JwtService;
import com.plato.platoBack.service.RestauranteContext;
import com.plato.platoBack.service.AcessoContext;
import com.plato.platoBack.enuns.NivelAcesso;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class TenantInterceptor implements HandlerInterceptor {
    private final JwtService jwtService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        if ("GET".equalsIgnoreCase(request.getMethod())
                && "/api/restaurantes".equals(request.getRequestURI())) {
            return true;
        }
        String authorization = request.getHeader("Authorization");
        NivelAcesso acesso = jwtService.obterNivelAcesso(authorization);
        try {
            AcessoContext.set(acesso);
            if (acesso != NivelAcesso.ROOT) {
                RestauranteContext.set(jwtService.obterRestauranteId(authorization));
            }
            autorizar(request, acesso);
            return true;
        } catch (RuntimeException exception) {
            RestauranteContext.clear();
            AcessoContext.clear();
            throw exception;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        RestauranteContext.clear();
        AcessoContext.clear();
    }

    private void autorizar(HttpServletRequest request, NivelAcesso acesso) {
        String path = request.getRequestURI();
        if (acesso == NivelAcesso.ROOT) {
            if (!path.startsWith("/api/restaurantes") && !path.startsWith("/usuario/perfil")) negar();
            return;
        }
        if (acesso == NivelAcesso.GERENTE || path.startsWith("/usuario/perfil")) return;

        boolean administracao = path.startsWith("/funcionario")
                || path.startsWith("/fornecedor")
                || path.startsWith("/api/fornecedores")
                || path.startsWith("/api/notas-fornecedores")
                || path.startsWith("/usuario")
                || (path.startsWith("/produto") && !"GET".equalsIgnoreCase(request.getMethod()));
        if (administracao) negar();
        if (acesso == NivelAcesso.ATENDENTE && path.startsWith("/pedido/finalizados")) negar();
        if (acesso == NivelAcesso.CAIXA && path.startsWith("/pedido/abertos")) negar();
    }

    private void negar() {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário sem permissão para esta operação");
    }
}
