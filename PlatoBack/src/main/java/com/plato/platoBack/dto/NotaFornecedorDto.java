package com.plato.platoBack.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotaFornecedorDto {
    private Long id;
    private Long fornecedorId;
    private String fornecedorNome;
    private LocalDate dataEmissao;
    private String numeroNota;
    private BigDecimal valorTotal;
    private String chaveAcesso;
    private String observacoes;
}
