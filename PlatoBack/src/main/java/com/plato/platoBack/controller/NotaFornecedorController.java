package com.plato.platoBack.controller;

import com.plato.platoBack.dto.NotaFornecedorDto;
import com.plato.platoBack.service.NotaFornecedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/notas-fornecedores")
@RequiredArgsConstructor
public class NotaFornecedorController {
    private final NotaFornecedorService notaFornecedorService;

    @GetMapping
    public ResponseEntity<List<NotaFornecedorDto>> listar() {
        return ResponseEntity.ok(notaFornecedorService.listar());
    }

    @PostMapping
    public ResponseEntity<NotaFornecedorDto> criar(@RequestBody NotaFornecedorDto dto) {
        NotaFornecedorDto criada = notaFornecedorService.criar(dto);
        return ResponseEntity.created(URI.create("/api/notas-fornecedores/" + criada.getId()))
                .body(criada);
    }
}
