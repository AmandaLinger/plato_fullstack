package com.plato.platoBack.repository;

import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.enuns.StatusSolicitacaoCadastro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;

public interface SolicitacaoCadastroRepository extends JpaRepository<SolicitacaoCadastro, Long> {
    List<SolicitacaoCadastro> findAllByStatusOrderByDataCriacaoAsc(StatusSolicitacaoCadastro status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select solicitacao from SolicitacaoCadastro solicitacao where solicitacao.id = :id")
    java.util.Optional<SolicitacaoCadastro> findByIdForUpdate(@Param("id") Long id);
}
