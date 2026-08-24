package com.plato.platoBack.repository;

import com.plato.platoBack.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    List<Fornecedor> findAllByAtivoTrue();

    Optional<Fornecedor> findByIdAndAtivoTrue(Long id);
}
