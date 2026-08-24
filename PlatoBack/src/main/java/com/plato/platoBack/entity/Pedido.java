package com.plato.platoBack.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.plato.platoBack.enuns.FormaPagamento;
import com.plato.platoBack.enuns.StatusCozinha;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "pedido")
public class Pedido {
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id")
    Restaurante restaurante;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotNull
    Integer numeroMesa;

    @JsonManagedReference
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ItemPedido> itens;

    Boolean pedidoAberto;

    @Builder.Default
    @Column(name = "enviar_cozinha", nullable = false, columnDefinition = "boolean default false")
    Boolean enviarCozinha = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_cozinha", length = 20)
    StatusCozinha statusCozinha;

    @Column(name = "criado_em")
    LocalDateTime criadoEm;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento", length = 20)
    FormaPagamento formaPagamento;

    LocalDate dataPedido;
}
