package com.analysisgg.modules.riotapi.domain.model;

import java.util.List;

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
    int neutralMinionsKilled,
    String teamPosition,
    List<ParticipantSummary> participants
) {
}
