package com.plato.platoBack.controller;


import com.plato.platoBack.dto.FornecedorDto;
import com.plato.platoBack.entity.Fornecedor;
import com.plato.platoBack.service.FornecedorService;
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
@RequestMapping({"/fornecedor", "/api/fornecedores"})
@AllArgsConstructor
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @GetMapping
    public ResponseEntity<List<Fornecedor>> getAllFornecedores() {
        return ResponseEntity.ok(fornecedorService.chamaTodosFornecedores());
    }

    @GetMapping("/{id}")
    public Fornecedor getFornecedor(@PathVariable Long id) throws BadRequestException {
        return fornecedorService.buscaFornecedor(id);
    }

    @PostMapping
    public ResponseEntity<Fornecedor> postFornecedor(@RequestBody FornecedorDto fornecedorDto) {
        return ResponseEntity.status(201).body(fornecedorService.cadastrarFornecedor(fornecedorDto));
    }

    @PutMapping("/{id}")
    public void atualizaFornecedor(@PathVariable Long id, @Validated @RequestBody FornecedorDto fornecedorDto) throws BadRequestException {
        fornecedorService.atualizarFornecedor(id,fornecedorDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletaFornecedor(@PathVariable Long id) throws BadRequestException {
        fornecedorService.deletarFornecedor(id);
    }
}
