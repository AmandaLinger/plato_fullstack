package com.plato.platoBack.dto;

import com.plato.platoBack.entity.Produto;

public record ProdutoPublicoDto(
        Long id,
        String nome,
        String descricao,
        Double preco,
        String imagemUrl,
        String categoria
) {
    public static ProdutoPublicoDto from(Produto produto) {
        return new ProdutoPublicoDto(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImagemUrl(),
                produto.getCategoria() == null || produto.getCategoria().isBlank()
                        ? "Outros"
                        : produto.getCategoria()
        );
    }
}
