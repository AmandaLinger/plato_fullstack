package com.plato.platoBack;

import com.plato.platoBack.entity.Restaurante;
import com.plato.platoBack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class LegacyTenantInitializer implements ApplicationRunner {
    private final RestauranteRepository restauranteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final MesaRepository mesaRepository;
    private final PedidoRepository pedidoRepository;
    private final NotaFornecedorRepository notaFornecedorRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Restaurante restaurante = restauranteRepository.findAll().stream().findFirst()
                .orElseGet(() -> restauranteRepository.save(Restaurante.builder()
                        .nome("Restaurante padrão")
                        .ativo(true)
                        .build()));

        usuarioRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        produtoRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        fornecedorRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        funcionarioRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        mesaRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        pedidoRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
        notaFornecedorRepository.findAll().stream().filter(item -> item.getRestaurante() == null)
                .forEach(item -> item.setRestaurante(restaurante));
    }
}
