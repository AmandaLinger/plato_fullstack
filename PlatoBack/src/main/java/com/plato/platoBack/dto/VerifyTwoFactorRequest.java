package com.plato.platoBack.dto;

public record VerifyTwoFactorRequest(String tempToken, String code) { }
