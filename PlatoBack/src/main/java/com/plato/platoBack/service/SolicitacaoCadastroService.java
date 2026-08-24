package com.plato.platoBack.service;

import com.plato.platoBack.dto.SolicitacaoCadastroDto;
import com.plato.platoBack.entity.SolicitacaoCadastro;
import com.plato.platoBack.enuns.StatusSolicitacaoCadastro;
import com.plato.platoBack.repository.SolicitacaoCadastroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoCadastroService {
    private final SolicitacaoCadastroRepository repository;

    public List<SolicitacaoCadastro> listarPendentes() {
        return repository.findAllByStatusOrderByDataCriacaoAsc(StatusSolicitacaoCadastro.PENDENTE);
    }

    @Transactional
    public void rejeitar(Long id) {
        SolicitacaoCadastro solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));
        if (solicitacao.getStatus() != StatusSolicitacaoCadastro.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A solicitação não está mais pendente");
        }
        solicitacao.setStatus(StatusSolicitacaoCadastro.REJEITADO);
        repository.save(solicitacao);
    }

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
