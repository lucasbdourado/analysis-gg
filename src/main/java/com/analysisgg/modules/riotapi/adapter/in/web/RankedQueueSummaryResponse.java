package com.analysisgg.modules.riotapi.adapter.in.web;

public record RankedQueueSummaryResponse(
        String queueType,
        String tier,
        String rank,
        Integer leaguePoints,
        Integer wins,
        Integer losses,
        Double winRate
) {
}
