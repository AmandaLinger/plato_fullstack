package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    List<Restaurante> findAllByAtivoTrueOrderByNomeAsc();
    Optional<Restaurante> findByIdAndAtivoTrue(Long id);
    boolean existsByNomeIgnoreCaseAndAtivoTrue(String nome);
}
