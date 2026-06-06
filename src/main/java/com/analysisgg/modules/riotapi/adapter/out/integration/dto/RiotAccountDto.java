package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

import com.analysisgg.modules.riotapi.domain.model.RiotAccount;

public record RiotAccountDto(
    String puuid,
    String gameName,
    String tagLine
) {
    public RiotAccount toDomain() {
        return new RiotAccount(puuid, gameName, tagLine);
    }
}
