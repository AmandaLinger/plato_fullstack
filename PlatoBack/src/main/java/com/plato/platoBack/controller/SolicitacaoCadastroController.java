package com.plato.platoBack.controller;

import com.plato.platoBack.dto.SolicitacaoCadastroDto;
import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.service.SolicitacaoCadastroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes-cadastro")
@RequiredArgsConstructor
public class SolicitacaoCadastroController {
    private final SolicitacaoCadastroService service;

    @GetMapping
    public List<SolicitacaoCadastro> listarPendentes() {
        return service.listarPendentes();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void rejeitar(@PathVariable Long id) {
        service.rejeitar(id);
    }

    @PostMapping
    public ResponseEntity<SolicitacaoCadastro> criar(@RequestBody SolicitacaoCadastroDto dto) {
        SolicitacaoCadastro criada = service.criar(dto);
        return ResponseEntity.created(URI.create("/api/solicitacoes-cadastro/" + criada.getId()))
                .body(criada);
    }
}
