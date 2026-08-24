package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findAllByRestauranteIdAndAtivoTrue(Long restauranteId);

    Optional<Funcionario> findByIdAndRestauranteIdAndAtivoTrue(Long id, Long restauranteId);
}
