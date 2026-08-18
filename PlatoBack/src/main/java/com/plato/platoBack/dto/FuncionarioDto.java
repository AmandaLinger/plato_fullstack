package com.plato.platoBack.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDto {
    String nome;
    String telefone;

    String cargo;
}
