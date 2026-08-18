package com.plato.platoBack.controller;

import com.plato.platoBack.dto.SolicitacaoCadastroDto;
import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.service.SolicitacaoCadastroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/solicitacoes-cadastro")
@RequiredArgsConstructor
public class SolicitacaoCadastroController {
    private final SolicitacaoCadastroService service;

    @PostMapping
    public ResponseEntity<SolicitacaoCadastro> criar(@RequestBody SolicitacaoCadastroDto dto) {
        SolicitacaoCadastro criada = service.criar(dto);
        return ResponseEntity.created(URI.create("/api/solicitacoes-cadastro/" + criada.getId()))
                .body(criada);
    }
}
