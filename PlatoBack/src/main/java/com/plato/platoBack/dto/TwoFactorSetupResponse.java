package com.plato.platoBack.dto;

public record TwoFactorSetupResponse(String secret, String otpauthUri) { }
