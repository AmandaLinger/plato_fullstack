package com.plato.platoBack.dto;

import lombok.*;
import com.plato.platoBack.enuns.NivelAcesso;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDto {
    String nome;

    String senha;

    NivelAcesso acesso;
}
