package com.plato.platoBack.repository;

import com.plato.platoBack.entity.RecoveryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;

public interface RecoveryCodeRepository extends JpaRepository<RecoveryCode, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select code from RecoveryCode code where code.usuario.id = :usuarioId and code.used = false")
    List<RecoveryCode> findUnusedForUpdate(@Param("usuarioId") Long usuarioId);
    void deleteAllByUsuarioId(Long usuarioId);
}
