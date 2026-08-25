package com.plato.platoBack.controller;

import com.plato.platoBack.dto.LoginRequest;
import com.plato.platoBack.dto.LoginResponse;
import com.plato.platoBack.dto.AuthLoginResponse;
import com.plato.platoBack.dto.VerifyTwoFactorRequest;
import com.plato.platoBack.service.TwoFactorService;
import com.plato.platoBack.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping({"/auth", "/api/auth"})
@AllArgsConstructor
public class AuthController {
    private final UsuarioService usuarioService;
    private final TwoFactorService twoFactorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.nome() == null || request.nome().isBlank()
                || request.senha() == null || request.senha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }

        try {
            AuthLoginResponse response = twoFactorService.login(request.restauranteId(), request.nome().trim(), request.senha());
            return ResponseEntity.status(response instanceof LoginResponse ? HttpStatus.OK : HttpStatus.ACCEPTED)
                    .body(response);
        } catch (BadRequestException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, exception.getMessage());
        }
    }

    @PostMapping("/login/verify-2fa")
    public LoginResponse verifyTwoFactor(@RequestBody VerifyTwoFactorRequest request) {
        if (request.tempToken() == null || request.tempToken().isBlank()
                || request.code() == null || request.code().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token temporário e código são obrigatórios");
        }
        return twoFactorService.verifyLogin(request.tempToken(), request.code());
    }
}
