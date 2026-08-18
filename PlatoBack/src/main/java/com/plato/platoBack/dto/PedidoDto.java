package com.plato.platoBack.dto;

import com.plato.platoBack.entity.ItemPedido;
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


    LocalDate dataPedido;
}
