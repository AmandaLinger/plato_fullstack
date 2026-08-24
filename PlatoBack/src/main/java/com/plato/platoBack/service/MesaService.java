package com.plato.platoBack.service;

import com.plato.platoBack.entity.Mesa;
import com.plato.platoBack.repository.MesaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService {

    private final MesaRepository mesaRepository;
    private final RestauranteContextService restauranteContext;

    public MesaService(MesaRepository mesaRepository, RestauranteContextService restauranteContext) {
        this.mesaRepository = mesaRepository;
        this.restauranteContext = restauranteContext;
    }

    public List<Mesa> listarTodas(){
        return mesaRepository.findAllByRestauranteIdOrderByNumeroAsc(restauranteContext.getId());
    }

    @Transactional
    public void atualizarQuantidadeMesas(int quantidadeDesejada) {
        Long restauranteId = restauranteContext.getId();
        long quantidadeAtual = mesaRepository.countByRestauranteId(restauranteId);

        if (quantidadeDesejada > quantidadeAtual) {
            // Cria as novas mesas que faltam
            for (int i = (int) quantidadeAtual + 1; i <= quantidadeDesejada; i++) {
                Mesa novaMesa = new Mesa();
                novaMesa.setNumero(i);
                novaMesa.setOcupada(false);
                novaMesa.setAtiva(true);
                novaMesa.setRestaurante(restauranteContext.getRestaurante());
                mesaRepository.save(novaMesa);
            }
        } else if (quantidadeDesejada < quantidadeAtual) {
            // Desativa ou remove as mesas sobressalentes
            List<Mesa> mesas = mesaRepository.findAllByRestauranteIdOrderByNumeroAsc(restauranteId);
            for (int i = quantidadeDesejada; i < mesas.size(); i++) {
                Mesa mesa = mesas.get(i);
                // Opcional: deletar apenas se não estiver ocupada, ou marcar ativa = false
                mesaRepository.delete(mesa);
            }
        }
    }
}
