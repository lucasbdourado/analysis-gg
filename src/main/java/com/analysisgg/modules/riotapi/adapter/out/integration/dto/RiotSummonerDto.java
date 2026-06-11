package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

public record RiotSummonerDto(
    String id,
    String accountId,
    String puuid,
    int profileIconId,
    long revisionDate,
    long summonerLevel
) {}
