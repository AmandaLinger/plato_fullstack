package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByNomeAndRestauranteId(String nome, Long restauranteId);

    List<Produto> findAllByRestauranteId(Long restauranteId);

    Optional<Produto> findByIdAndRestauranteId(Long id, Long restauranteId);
}
