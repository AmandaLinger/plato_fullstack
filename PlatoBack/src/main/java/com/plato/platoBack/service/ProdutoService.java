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

    public Produto criarProduto(ProdutoDto produto) throws BadRequestException {
        Produto p = produtoRepository.findByNome(produto.getNome()).orElse(null);

        if(p != null){
            throw new BadRequestException("Nome do produto já cadastrado no banco");
        }

        return produtoRepository.save(Produto.builder()
                .nome(produto.getNome())
                .preco(produto.getPreco())
                .descricao(produto.getDescricao())
                .imagemUrl(produto.getImagemUrl())
                .build()
        );
    }

    @Transactional
    public Produto atualizaProduto(Long id, ProdutoDto produtoDto) throws BadRequestException {
        Produto p = produtoRepository.findById(id)
                .orElseThrow( () -> new BadRequestException("Nenhum produto encontrado"));

        p.setPreco(produtoDto.getPreco());
        p.setDescricao(produtoDto.getDescricao());
        p.setNome(produtoDto.getNome());
        p.setImagemUrl(produtoDto.getImagemUrl());

        return produtoRepository.save(p);
    }

    @Transactional
    public void deletarProduto(Long id){
        produtoRepository.deleteById(id);
    }

    public List<Produto> chamaProdutos() throws BadRequestException {
        List<Produto> listaProdutos = produtoRepository.findAll();

        if(listaProdutos == null || listaProdutos.isEmpty()){
            throw new BadRequestException("Nenhum produto encontrado");
        }
        return listaProdutos;
    }
}
