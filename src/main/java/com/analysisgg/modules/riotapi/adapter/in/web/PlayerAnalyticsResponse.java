package com.analysisgg.modules.riotapi.adapter.in.web;

import java.util.List;

public record PlayerAnalyticsResponse(
        String puuid,
        String gameName,
        String tagLine,
        String region,
        RankedQueuesResponse rankedQueues,
        List<MatchResponse> matches
) {
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
        }
    }
}
