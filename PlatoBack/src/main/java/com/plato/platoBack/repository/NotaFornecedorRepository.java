package com.plato.platoBack.repository;

import com.plato.platoBack.entity.NotaFornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface NotaFornecedorRepository extends JpaRepository<NotaFornecedor, Long> {
    List<NotaFornecedor> findAllByRestauranteId(Long restauranteId);

    List<NotaFornecedor> findByRestauranteIdAndDataEmissaoBetweenOrderByDataEmissaoAscIdAsc(
            Long restauranteId,
            LocalDate inicio,
            LocalDate fim
    );
}
