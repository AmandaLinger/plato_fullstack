package com.plato.platoBack.controller;


import com.plato.platoBack.dto.FuncionarioDto;
import com.plato.platoBack.dto.FuncionarioCriadoResponse;
import com.plato.platoBack.entity.Funcionario;
import com.plato.platoBack.service.FuncionarioService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/funcionario")
@AllArgsConstructor
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping
    public List<Funcionario> getFuncionarios() {
        return funcionarioService.chamaTodosFuncionarios();
    }

    @GetMapping("/{id}")
    public Funcionario getFuncionarioById(@PathVariable Long id) throws BadRequestException {
        return funcionarioService.chamaFuncionario(id);
    }

    @PostMapping
    public FuncionarioCriadoResponse cadastrarFuncionario(@RequestBody FuncionarioDto funcionarioDto) throws BadRequestException {
        return FuncionarioCriadoResponse.from(funcionarioService.cadastrarFuncionario(funcionarioDto));
    }

    @PutMapping("/{id}")
    public void atualizarFuncionario(@PathVariable Long id, @Validated @RequestBody FuncionarioDto funcionarioDto) throws BadRequestException {
        funcionarioService.atualizaFuncionario(id,funcionarioDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarFuncionario(@PathVariable Long id) throws BadRequestException {
        funcionarioService.deletarFuncionario(id);
    }
}
