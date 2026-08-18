package com.plato.platoBack.service;

import com.plato.platoBack.entity.Mesa;
import com.plato.platoBack.repository.MesaRepository;
import jakarta.transaction.Transactional;

import java.util.List;

public class MesaService {

    private final MesaRepository mesaRepository;

    public MesaService(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    public List<Mesa> listarTodas(){
        return mesaRepository.findAllByOrderByNumeroAsc();
    }

    @Transactional
    public void atualizarQuantidadeMesas(int quantidadeDesejada) {
        long quantidadeAtual = mesaRepository.count();

        if (quantidadeDesejada > quantidadeAtual) {
            // Cria as novas mesas que faltam
            for (int i = (int) quantidadeAtual + 1; i <= quantidadeDesejada; i++) {
                Mesa novaMesa = new Mesa();
                novaMesa.setNumero(i);
                novaMesa.setOcupada(false);
                novaMesa.setAtiva(true);
                mesaRepository.save(novaMesa);
            }
        } else if (quantidadeDesejada < quantidadeAtual) {
            // Desativa ou remove as mesas sobressalentes
            List<Mesa> mesas = mesaRepository.findAllByOrderByNumeroAsc();
            for (int i = quantidadeDesejada; i < mesas.size(); i++) {
                Mesa mesa = mesas.get(i);
                // Opcional: deletar apenas se não estiver ocupada, ou marcar ativa = false
                mesaRepository.delete(mesa);
            }
        }
    }
}
