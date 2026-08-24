package com.plato.platoBack.dto;

import java.util.List;

public record CardapioPublicoResponse(
        Long restauranteId,
        String restauranteNome,
        List<ProdutoPublicoDto> produtos
) {
}
