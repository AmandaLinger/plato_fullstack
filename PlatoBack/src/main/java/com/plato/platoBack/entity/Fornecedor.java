package com.plato.platoBack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fornecedor")
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotNull
    String nome;

    String cnpj;

    String telefone;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "boolean default true")
    Boolean ativo = true;
}
