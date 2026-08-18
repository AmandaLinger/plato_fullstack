package com.plato.platoBack.controller;

import com.plato.platoBack.dto.ProdutoDto;
import com.plato.platoBack.entity.Produto;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.plato.platoBack.service.ProdutoService;

import java.util.List;

@Validated
@RestController
@RequestMapping("/produto")
@AllArgsConstructor
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody ProdutoDto produtoDto)
            throws BadRequestException {
        return ResponseEntity.ok(produtoService.criarProduto(produtoDto));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Produto> chamaProdutos() throws BadRequestException {
        List<Produto> listaProdutos = produtoService.chamaProdutos();
        return listaProdutos;
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Produto atualizarProduto(@PathVariable Long id,@RequestBody ProdutoDto produtoDto) throws BadRequestException {
        return produtoService.atualizaProduto(id, produtoDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarProduto(@PathVariable Long id) throws BadRequestException {
        produtoService.deletarProduto(id);
    }
}
