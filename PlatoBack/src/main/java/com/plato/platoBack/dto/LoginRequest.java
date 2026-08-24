package com.plato.platoBack.dto;

public record LoginRequest(
        Long restauranteId,
        String nome,
        String senha
) {}
