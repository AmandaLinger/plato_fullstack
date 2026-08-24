package com.plato.platoBack.dto;

import com.plato.platoBack.entity.ItemPedido;
import com.plato.platoBack.enuns.FormaPagamento;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDto {
    Integer numeroMesa;

    List<ItemPedido> itens;


    Boolean pedidoAberto;

    Boolean enviarCozinha;

    FormaPagamento formaPagamento;

    LocalDate dataPedido;
}
