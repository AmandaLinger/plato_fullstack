package com.plato.platoBack.dto;

import com.plato.platoBack.entity.ItemPedido;
import com.plato.platoBack.entity.Produto;

public record ItemCozinhaResponse(Long id, Produto produto, Double quantidade, String observacoes) {
    public static ItemCozinhaResponse from(ItemPedido item) {
        return new ItemCozinhaResponse(item.getId(), item.getProduto(), item.getQuantidade(), item.getObservacoes());
    }
}
