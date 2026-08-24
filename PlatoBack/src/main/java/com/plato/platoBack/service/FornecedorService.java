package com.plato.platoBack.service;

import com.plato.platoBack.dto.FornecedorDto;
import com.plato.platoBack.entity.Fornecedor;
import com.plato.platoBack.repository.FornecedorRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    public List<Fornecedor> chamaTodosFornecedores() {
        return fornecedorRepository.findAllByAtivoTrue();
    }

    public Fornecedor cadastrarFornecedor(FornecedorDto fornecedorDto) {
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.setNome(fornecedorDto.getNome());
        fornecedor.setCnpj(fornecedorDto.getCnpj());
        fornecedor.setTelefone(fornecedorDto.getTelefone());
        fornecedor.setAtivo(true);
        return fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public void atualizarFornecedor(Long id, FornecedorDto fornecedorDto) throws BadRequestException {
        Fornecedor fornecedor = buscarAtivo(id);

        fornecedor.setNome(fornecedorDto.getNome());
        fornecedor.setCnpj(fornecedorDto.getCnpj());
        fornecedor.setTelefone(fornecedorDto.getTelefone());

        fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public void deletarFornecedor(Long id) throws BadRequestException {
        Fornecedor fornecedor = buscarAtivo(id);
        fornecedor.setAtivo(false);
        fornecedorRepository.save(fornecedor);
    }

    public Fornecedor buscaFornecedor(Long id) throws BadRequestException {
        return buscarAtivo(id);
    }

    private Fornecedor buscarAtivo(Long id) {
        return fornecedorRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nenhum fornecedor encontrado"
                ));
    }
}
