package com.plato.platoBack.dto;

import lombok.*;
import com.plato.platoBack.enuns.NivelAcesso;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDto {
    String nome;
    String telefone;

    String cargo;

    NivelAcesso acesso;
}
