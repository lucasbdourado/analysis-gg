package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

public record RiotLeagueEntryDto(
    String queueType,
    String tier,
    String rank,
    Integer leaguePoints,
    Integer wins,
    Integer losses
) {
}
