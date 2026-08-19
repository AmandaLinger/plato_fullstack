package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Usuario;

public record PerfilResponse(Long id, String nome) {
    public static PerfilResponse from(Usuario usuario) {
        return new PerfilResponse(usuario.getId(), usuario.getNome());
    }
}
