package com.plato.platoBack.controller;

import com.plato.platoBack.dto.UsuarioDto;
import com.plato.platoBack.dto.AtualizarPerfilRequest;
import com.plato.platoBack.dto.PerfilResponse;
import com.plato.platoBack.entity.Usuario;
import com.plato.platoBack.service.UsuarioService;
import com.plato.platoBack.service.JwtService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/usuario")
@AllArgsConstructor
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario (@RequestBody UsuarioDto usuarioDto) throws BadRequestException {
        usuarioService.criarUsuario(usuarioDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Usuario> listaUsuarios() throws BadRequestException {
        List<Usuario> listaUsuarios =  usuarioService.chamaUsuarios();
        return listaUsuarios;
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarUsuario(@RequestBody UsuarioDto usuarioDto, @PathVariable Long id)
            throws BadRequestException {
        usuarioService.atualizarUsuario(id, usuarioDto);
    }

    @GetMapping("/perfil")
    public PerfilResponse buscarPerfil(@RequestHeader(value = "Authorization", required = false) String authorization)
            throws BadRequestException {
        Long usuarioId = jwtService.obterUsuarioId(authorization);
        return PerfilResponse.from(usuarioService.buscarPorId(usuarioId));
    }

    @PatchMapping("/perfil")
    public PerfilResponse atualizarPerfil(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody AtualizarPerfilRequest request
    ) throws BadRequestException {
        if (request.nome() == null || request.nome().isBlank()) {
            throw new BadRequestException("O login é obrigatório");
        }

        Long usuarioId = jwtService.obterUsuarioId(authorization);
        usuarioService.atualizarUsuario(
                usuarioId,
                new UsuarioDto(request.nome().trim(), request.senha())
        );
        return PerfilResponse.from(usuarioService.buscarPorId(usuarioId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarUsuario(@PathVariable Long id) throws BadRequestException {
        usuarioService.deletarUsuario(id);
    }
}
