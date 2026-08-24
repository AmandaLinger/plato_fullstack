package com.plato.platoBack.service;

import com.plato.platoBack.enuns.NivelAcesso;

public final class AcessoContext {
    private static final ThreadLocal<NivelAcesso> ACESSO = new ThreadLocal<>();
    private AcessoContext() { }
    public static void set(NivelAcesso acesso) { ACESSO.set(acesso); }
    public static NivelAcesso get() { return ACESSO.get(); }
    public static void clear() { ACESSO.remove(); }
}
