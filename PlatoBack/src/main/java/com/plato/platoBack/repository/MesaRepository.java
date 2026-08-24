package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    List<Mesa> findAllByRestauranteIdOrderByNumeroAsc(Long restauranteId);
    long countByRestauranteId(Long restauranteId);
}
