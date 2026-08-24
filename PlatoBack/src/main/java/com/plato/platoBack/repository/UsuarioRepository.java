package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNomeAndAtivoTrue(String nome);

    boolean existsByNomeAndAtivoTrueAndIdNot(String nome, Long id);

    List<Usuario> findAllByAtivoTrue();

    Optional<Usuario> findByIdAndAtivoTrue(Long id);
}
