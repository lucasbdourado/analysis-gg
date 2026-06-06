package com.analysisgg.modules.riotapi.domain.valueobject;

public record Puuid(String value) {
    public Puuid {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("PUUID cannot be null or blank.");
        }
    }
}
