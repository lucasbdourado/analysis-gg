package com.analysisgg.modules.riotapi.adapter.in.web;

public record MatchResponse(
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
        int neutralMinionsKilled,
        String teamPosition
) {
}
