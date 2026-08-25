package com.plato.platoBack.dto;

import java.util.List;

public record TwoFactorEnableResponse(boolean enabled, List<String> recoveryCodes) { }
