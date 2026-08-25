package com.plato.platoBack.dto;

public sealed interface AuthLoginResponse permits LoginResponse, TwoFactorRequiredResponse { }
