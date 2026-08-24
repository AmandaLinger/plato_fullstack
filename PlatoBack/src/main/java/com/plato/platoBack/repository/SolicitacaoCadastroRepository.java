package com.plato.platoBack.repository;

import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.enuns.StatusSolicitacaoCadastro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoCadastroRepository extends JpaRepository<SolicitacaoCadastro, Long> {
    List<SolicitacaoCadastro> findAllByStatusOrderByDataCriacaoAsc(StatusSolicitacaoCadastro status);
}
