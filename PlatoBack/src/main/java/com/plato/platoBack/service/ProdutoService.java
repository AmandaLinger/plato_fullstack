package com.plato.platoBack.service;

import com.plato.platoBack.dto.ProdutoDto;
import com.plato.platoBack.entity.Produto;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import com.plato.platoBack.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private RestauranteContextService restauranteContext;

    public Produto criarProduto(ProdutoDto produto) throws BadRequestException {
        Produto p = produtoRepository.findByNomeAndRestauranteId(produto.getNome(), restauranteContext.getId()).orElse(null);

        if(p != null){
            throw new BadRequestException("Nome do produto já cadastrado no banco");
        }

        return produtoRepository.save(Produto.builder()
                .nome(produto.getNome())
                .preco(produto.getPreco())
                .descricao(produto.getDescricao())
                .imagemUrl(produto.getImagemUrl())
                .restaurante(restauranteContext.getRestaurante())
                .build()
        );
    }

    @Transactional
    public Produto atualizaProduto(Long id, ProdutoDto produtoDto) throws BadRequestException {
        Produto p = produtoRepository.findByIdAndRestauranteId(id, restauranteContext.getId())
                .orElseThrow( () -> new BadRequestException("Nenhum produto encontrado"));

        p.setPreco(produtoDto.getPreco());
        p.setDescricao(produtoDto.getDescricao());
        p.setNome(produtoDto.getNome());
        p.setImagemUrl(produtoDto.getImagemUrl());

        return produtoRepository.save(p);
    }

    @Transactional
    public void deletarProduto(Long id){
        Produto produto = produtoRepository.findByIdAndRestauranteId(id, restauranteContext.getId())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Nenhum produto encontrado"));
        produtoRepository.delete(produto);
    }

    public List<Produto> chamaProdutos() throws BadRequestException {
        List<Produto> listaProdutos = produtoRepository.findAllByRestauranteId(restauranteContext.getId());

        if(listaProdutos == null || listaProdutos.isEmpty()){
            throw new BadRequestException("Nenhum produto encontrado");
        }
        return listaProdutos;
    }
}
