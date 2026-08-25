package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.enuns.NivelAcesso;

public record GerenteResponse(Long id, String nome, NivelAcesso acesso) {
    public static GerenteResponse from(Usuario usuario) {
        return new GerenteResponse(usuario.getId(), usuario.getNome(), usuario.getAcesso());
    }
}
