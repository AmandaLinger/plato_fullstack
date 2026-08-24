package com.plato.platoBack.controller;

import com.plato.platoBack.dto.LoginRequest;
import com.plato.platoBack.dto.LoginResponse;
import com.plato.platoBack.dto.PerfilResponse;
import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.service.JwtService;
import com.plato.platoBack.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        if (request.nome() == null || request.nome().isBlank()
                || request.senha() == null || request.senha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login e senha são obrigatórios");
        }

        try {
            Usuario usuario = usuarioService.autenticar(request.restauranteId(), request.nome().trim(), request.senha());
            return new LoginResponse(jwtService.gerarToken(usuario), PerfilResponse.from(usuario));
        } catch (BadRequestException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, exception.getMessage());
        }
    }
}
