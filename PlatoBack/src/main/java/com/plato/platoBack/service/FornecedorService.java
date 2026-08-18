package com.plato.platoBack.service;

import com.plato.platoBack.dto.FornecedorDto;
import com.plato.platoBack.entity.Fornecedor;
import com.plato.platoBack.repository.FornecedorRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    public List<Fornecedor> chamaTodosFornecedores() {
        return fornecedorRepository.findAll();
    }

    public Fornecedor cadastrarFornecedor(FornecedorDto fornecedorDto) {
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.setNome(fornecedorDto.getNome());
        fornecedor.setCnpj(fornecedorDto.getCnpj());
        return fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public void atualizarFornecedor(Long id, FornecedorDto fornecedorDto) throws BadRequestException {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow( () -> new BadRequestException("Nenhum fornecedor encontrado"));

        fornecedor.setNome(fornecedorDto.getNome());
        fornecedor.setCnpj(fornecedorDto.getCnpj());

        fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public void deletarFornecedor(Long id) throws BadRequestException {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow( () -> new BadRequestException("Nenhum fornecedor encontrado"));

        fornecedorRepository.delete(fornecedor);
    }

    public Fornecedor buscaFornecedor(Long id) throws BadRequestException {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow( () -> new BadRequestException("Nenhum fornecedor encontrado"));

        return fornecedor;
    }
}
