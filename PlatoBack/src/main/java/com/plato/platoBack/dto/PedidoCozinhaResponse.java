package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Pedido;
import com.plato.platoBack.enuns.StatusCozinha;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoCozinhaResponse(
        Long id,
        Integer numeroMesa,
        List<ItemCozinhaResponse> itens,
        Boolean pedidoAberto,
        LocalDate dataPedido,
        Boolean enviarCozinha,
        StatusCozinha statusCozinha,
        LocalDateTime criadoEm
) {
    public static PedidoCozinhaResponse from(Pedido pedido) {
        List<ItemCozinhaResponse> itensCozinha = pedido.getItens().stream()
                .filter(item -> Boolean.TRUE.equals(item.getEnviarParaCozinha()))
                .map(ItemCozinhaResponse::from)
                .toList();
        return new PedidoCozinhaResponse(
                pedido.getId(), pedido.getNumeroMesa(), itensCozinha, pedido.getPedidoAberto(),
                pedido.getDataPedido(), pedido.getEnviarCozinha(), pedido.getStatusCozinha(), pedido.getCriadoEm()
        );
    }
}
