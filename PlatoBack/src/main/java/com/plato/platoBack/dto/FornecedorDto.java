package com.plato.platoBack.dto;

import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FornecedorDto {

    Long id;

    @NotNull
    String nome;

    String cnpj;
}
