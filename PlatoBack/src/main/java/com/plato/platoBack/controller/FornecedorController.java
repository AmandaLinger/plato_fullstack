package com.plato.platoBack.controller;


import com.plato.platoBack.dto.FornecedorDto;
import com.plato.platoBack.dto.PedidoDto;
import com.plato.platoBack.entity.Fornecedor;
import com.plato.platoBack.repository.FornecedorRepository;
import com.plato.platoBack.service.FornecedorService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/fornecedor")
@AllArgsConstructor
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @GetMapping
    public ResponseEntity<List<Fornecedor>> getAllFornecedores() {
        return ResponseEntity.ok(fornecedorService.chamaTodosFornecedores());
    }

    @GetMapping("/{id}")
    public Fornecedor getFornecedor(Long id) throws BadRequestException {
        return fornecedorService.buscaFornecedor(id);
    }

    @PostMapping
    public ResponseEntity<Fornecedor> postFornecedor(@RequestBody FornecedorDto fornecedorDto) {
        fornecedorService.cadastrarFornecedor(fornecedorDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public void atualizaFornecedor(@PathVariable Long id, @Validated @RequestBody FornecedorDto fornecedorDto) throws BadRequestException {
        fornecedorService.atualizarFornecedor(id,fornecedorDto);
    }

    @DeleteMapping("/{id}")
    public void deletaFornecedor(@PathVariable Long id) throws BadRequestException {
        fornecedorService.deletarFornecedor(id);
    }
}
