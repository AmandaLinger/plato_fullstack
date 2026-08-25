package com.plato.platoBack.dto;

public record TwoFactorRequiredResponse(boolean require2FA, String tempToken) implements AuthLoginResponse { }
