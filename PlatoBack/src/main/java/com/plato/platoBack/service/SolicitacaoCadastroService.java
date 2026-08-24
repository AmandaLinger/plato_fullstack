package com.plato.platoBack.service;

import com.plato.platoBack.dto.SolicitacaoCadastroDto;
import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.enuns.StatusSolicitacaoCadastro;
import com.plato.platoBack.repository.SolicitacaoCadastroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SolicitacaoCadastroService {
    private final SolicitacaoCadastroRepository repository;

    public SolicitacaoCadastro criar(SolicitacaoCadastroDto dto) {
        if (!StringUtils.hasText(dto.getNomeEstabelecimento())
                || !StringUtils.hasText(dto.getNomeResponsavel())
                || !StringUtils.hasText(dto.getTelefone())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todos os campos são obrigatórios");
        }

        SolicitacaoCadastro solicitacao = SolicitacaoCadastro.builder()
                .nomeEstabelecimento(dto.getNomeEstabelecimento().trim())
                .nomeResponsavel(dto.getNomeResponsavel().trim())
                .telefone(dto.getTelefone().trim())
                .status(StatusSolicitacaoCadastro.PENDENTE)
                .dataCriacao(LocalDateTime.now())
                .build();
        return repository.save(solicitacao);
    }
}
