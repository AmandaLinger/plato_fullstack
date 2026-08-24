package com.plato.platoBack.controller;

import com.plato.platoBack.dto.CardapioPublicoResponse;
import com.plato.platoBack.service.CardapioPublicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/restaurantes")
public class CardapioPublicoController {
    private final CardapioPublicoService service;

    @GetMapping("/{id}/cardapio")
    public CardapioPublicoResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }
}
