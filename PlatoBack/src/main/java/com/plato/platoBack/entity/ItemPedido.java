package com.plato.platoBack.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "item_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "pedido_id")
    Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    Produto produto;

    Double quantidade;

    @Column(length = 500)
    String observacoes;

    @Builder.Default
    @Column(name = "enviar_para_cozinha", nullable = false, columnDefinition = "boolean default false")
    Boolean enviarParaCozinha = false;

}
