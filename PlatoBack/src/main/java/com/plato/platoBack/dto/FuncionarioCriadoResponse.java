package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Funcionario;
import com.plato.platoBack.enuns.NivelAcesso;

public record FuncionarioCriadoResponse(
        Long id,
        String nome,
        String telefone,
        String cargo,
        NivelAcesso acesso,
        String restauranteNome
) {
    public static FuncionarioCriadoResponse from(Funcionario funcionario) {
        return new FuncionarioCriadoResponse(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getTelefone(),
                funcionario.getCargo(),
                funcionario.getAcesso(),
                funcionario.getRestaurante().getNome()
        );
    }
}
