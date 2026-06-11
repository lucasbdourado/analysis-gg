package com.analysisgg.modules.riotapi.domain.model;

public record RiotAccount(
    String puuid,
    String gameName,
    String tagLine,
    int profileIconId,
    long summonerLevel
) {
    public RiotAccount(String puuid, String gameName, String tagLine) {
        this(puuid, gameName, tagLine, 29, 0L);
    }
}
