package com.plato.platoBack.dto;

public record LoginResponse(String token, PerfilResponse usuario) implements AuthLoginResponse {
}
