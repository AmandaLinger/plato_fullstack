package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNomeAndRestauranteIdAndAtivoTrue(String nome, Long restauranteId);

    boolean existsByNomeAndRestauranteIdAndAtivoTrueAndIdNot(String nome, Long restauranteId, Long id);

    List<Usuario> findAllByRestauranteIdAndAtivoTrue(Long restauranteId);

    Optional<Usuario> findByIdAndRestauranteIdAndAtivoTrue(Long id, Long restauranteId);
}
