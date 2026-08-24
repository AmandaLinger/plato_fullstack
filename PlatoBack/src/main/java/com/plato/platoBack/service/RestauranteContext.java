package com.plato.platoBack.service;

public final class RestauranteContext {
    private static final ThreadLocal<Long> RESTAURANTE_ID = new ThreadLocal<>();

    private RestauranteContext() { }

    public static void set(Long restauranteId) { RESTAURANTE_ID.set(restauranteId); }
    public static Long get() { return RESTAURANTE_ID.get(); }
    public static void clear() { RESTAURANTE_ID.remove(); }
}
