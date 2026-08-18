package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Pedido;
import com.plato.platoBack.entity.Produto;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoDto {

    Produto produto;

    Double quantidade;

}
