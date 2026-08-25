package com.plato.platoBack.controller;

import com.plato.platoBack.dto.TwoFactorCodeRequest;
import com.plato.platoBack.dto.TwoFactorEnableResponse;
import com.plato.platoBack.dto.TwoFactorSetupResponse;
import com.plato.platoBack.service.JwtService;
import com.plato.platoBack.service.TwoFactorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/2fa")
@RequiredArgsConstructor
public class AdminTwoFactorController {
    private final TwoFactorService twoFactorService;
    private final JwtService jwtService;

    @PostMapping("/setup")
    public TwoFactorSetupResponse setup(@RequestHeader("Authorization") String authorization) {
        return twoFactorService.setup(jwtService.obterUsuarioId(authorization));
    }

    @PostMapping("/enable")
    public TwoFactorEnableResponse enable(
            @RequestHeader("Authorization") String authorization,
            @RequestBody TwoFactorCodeRequest request
    ) {
        if (request.code() == null || request.code().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código 2FA obrigatório");
        }
        return twoFactorService.enable(jwtService.obterUsuarioId(authorization), request.code());
    }
}
