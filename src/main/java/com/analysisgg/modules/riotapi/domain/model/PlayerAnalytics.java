package com.analysisgg.modules.riotapi.domain.model;

import java.util.List;

public record PlayerAnalytics(
    String puuid,
    String gameName,
    String tagLine,
    String region,
    RankedQueues rankedQueues,
    List<MatchSummary> matches
) {
    public PlayerAnalytics(String puuid, String gameName, String tagLine, String region, List<MatchSummary> matches) {
        this(puuid, gameName, tagLine, region, RankedQueues.unranked(), matches);
    }

    public PlayerAnalytics {
        if (rankedQueues == null) {
            rankedQueues = RankedQueues.unranked();
        }
        if (matches != null) {
            matches = List.copyOf(matches);
        }
    }
}
