package com.analysisgg.modules.riotapi.adapter.in.web;

import java.util.List;

public record PlayerAnalyticsResponse(
        String puuid,
        String gameName,
        String tagLine,
        String region,
        int profileIconId,
        long summonerLevel,
        RankedQueuesResponse rankedQueues,
        List<MatchResponse> matches,
        List<PastSeasonRankResponse> pastSeasonRanks
) {
    public PlayerAnalyticsResponse(
            String puuid,
            String gameName,
            String tagLine,
            String region,
            RankedQueuesResponse rankedQueues,
            List<MatchResponse> matches
    ) {
        this(puuid, gameName, tagLine, region, 29, 0L, rankedQueues, matches, List.of());
    }

    public PlayerAnalyticsResponse(
            String puuid,
            String gameName,
            String tagLine,
            String region,
            List<MatchResponse> matches
    ) {
        this(puuid, gameName, tagLine, region, null, matches);
    }

    public PlayerAnalyticsResponse {
        if (rankedQueues == null) {
            rankedQueues = new RankedQueuesResponse(
                    new RankedQueueSummaryResponse("RANKED_SOLO_5x5", null, null, null, null, null, null),
                    new RankedQueueSummaryResponse("RANKED_FLEX_SR", null, null, null, null, null, null)
            );
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
