package com.plato.platoBack.service;

import com.plato.platoBack.dto.NotaFornecedorDto;
import com.plato.platoBack.entity.Fornecedor;
import com.plato.platoBack.entity.NotaFornecedor;
import com.plato.platoBack.repository.FornecedorRepository;
import com.plato.platoBack.repository.NotaFornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotaFornecedorService {
    private final NotaFornecedorRepository notaFornecedorRepository;
    private final FornecedorRepository fornecedorRepository;

    @Transactional
    public NotaFornecedorDto criar(NotaFornecedorDto dto) {
        if (dto.getFornecedorId() == null || dto.getDataEmissao() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fornecedor e data de emissão são obrigatórios"
            );
        }

        Fornecedor fornecedor = fornecedorRepository.findByIdAndAtivoTrue(dto.getFornecedorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Fornecedor não encontrado"
                ));

        NotaFornecedor nota = NotaFornecedor.builder()
                .fornecedor(fornecedor)
                .dataEmissao(dto.getDataEmissao())
                .numeroNota(dto.getNumeroNota())
                .valorTotal(dto.getValorTotal())
                .chaveAcesso(dto.getChaveAcesso())
                .observacoes(dto.getObservacoes())
                .build();

        return toDto(notaFornecedorRepository.save(nota));
    }

    @Transactional(readOnly = true)
    public List<NotaFornecedorDto> listar() {
        return notaFornecedorRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorio(LocalDate inicio, LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data final não pode ser anterior à data inicial"
            );
        }

        List<NotaFornecedor> notas = notaFornecedorRepository
                .findByDataEmissaoBetweenOrderByDataEmissaoAscIdAsc(inicio, fim);
        StringBuilder csv = new StringBuilder(
                "\uFEFFNúmero da Nota;Data de Emissão;Fornecedor;CNPJ;Chave de Acesso;Valor Total (R$);Observações\r\n"
        );

        for (NotaFornecedor nota : notas) {
            csv.append(csvCell(nota.getNumeroNota())).append(';')
                    .append(csvCell(nota.getDataEmissao().toString())).append(';')
                    .append(csvCell(nota.getFornecedor().getNome())).append(';')
                    .append(csvCell(nota.getFornecedor().getCnpj())).append(';')
                    .append(csvCell(nota.getChaveAcesso())).append(';')
                    .append(csvCell(nota.getValorTotal() == null ? "" : nota.getValorTotal().toPlainString().replace('.', ','))).append(';')
                    .append(csvCell(nota.getObservacoes()))
                    .append("\r\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvCell(String value) {
        String safeValue = value == null ? "" : value;
        if (!safeValue.isEmpty() && "=+-@".indexOf(safeValue.charAt(0)) >= 0) {
            safeValue = "'" + safeValue;
        }
        return "\"" + safeValue.replace("\"", "\"\"") + "\"";
    }

    private NotaFornecedorDto toDto(NotaFornecedor nota) {
        return NotaFornecedorDto.builder()
                .id(nota.getId())
                .fornecedorId(nota.getFornecedor().getId())
                .fornecedorNome(nota.getFornecedor().getNome())
                .dataEmissao(nota.getDataEmissao())
                .numeroNota(nota.getNumeroNota())
                .valorTotal(nota.getValorTotal())
                .chaveAcesso(nota.getChaveAcesso())
                .observacoes(nota.getObservacoes())
                .build();
    }
}
