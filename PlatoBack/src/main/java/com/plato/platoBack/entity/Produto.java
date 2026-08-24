package com.plato.platoBack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="produto")
@Entity
public class Produto {
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id")
    Restaurante restaurante;

    @Column(name = "imagem_url", columnDefinition = "TEXT")
    private String imagemUrl;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotNull
    String nome;

    @NotNull
    Double preco;

    String descricao;

}
