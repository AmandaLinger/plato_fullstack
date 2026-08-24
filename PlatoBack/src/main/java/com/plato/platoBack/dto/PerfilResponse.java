package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Usuario;

public record PerfilResponse(Long id, String nome, com.plato.platoBack.enuns.NivelAcesso acesso, Long restauranteId) {
    public static PerfilResponse from(Usuario usuario) {
        return new PerfilResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getAcesso(),
                usuario.getRestaurante() == null ? null : usuario.getRestaurante().getId()
        );
    }
}
