package com.plato.platoBack.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoDto {
    String nome;

    Double preco;

    String descricao;

    String imagemUrl;

    String categoria;

} 
