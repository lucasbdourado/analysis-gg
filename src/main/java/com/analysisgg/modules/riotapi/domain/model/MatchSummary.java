package com.analysisgg.modules.riotapi.domain.model;

public record MatchSummary(
    String matchId,
    long gameDuration,
    long gameCreation,
    int queueId,
    boolean win,
    int championId,
    String championName,
    int kills,
    int deaths,
    int assists,
    int totalMinionsKilled,
    int neutralMinionsKilled
) {
}
