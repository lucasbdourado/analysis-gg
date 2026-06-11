package com.analysisgg.modules.riotapi.domain.model;

import java.util.List;

public record PlayerAnalytics(
    String puuid,
    String gameName,
    String tagLine,
    String region,
    int profileIconId,
    long summonerLevel,
    RankedQueues rankedQueues,
    List<MatchSummary> matches,
    List<PastSeasonRank> pastSeasonRanks
) {
    public PlayerAnalytics(String puuid, String gameName, String tagLine, String region, RankedQueues rankedQueues, List<MatchSummary> matches) {
        this(puuid, gameName, tagLine, region, 29, 0L, rankedQueues, matches, List.of());
    }

    public PlayerAnalytics(String puuid, String gameName, String tagLine, String region, List<MatchSummary> matches) {
        this(puuid, gameName, tagLine, region, RankedQueues.unranked(), matches);
    }

    public PlayerAnalytics {
        if (rankedQueues == null) {
            rankedQueues = RankedQueues.unranked();
        }
        if (matches != null) {
            matches = List.copyOf(matches);
        } else {
            matches = List.of();
        }
        if (pastSeasonRanks != null) {
            pastSeasonRanks = List.copyOf(pastSeasonRanks);
        } else {
            pastSeasonRanks = List.of();
        }
    }
}
