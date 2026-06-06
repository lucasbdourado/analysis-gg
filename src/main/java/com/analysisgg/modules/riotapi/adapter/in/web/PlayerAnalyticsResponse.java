package com.analysisgg.modules.riotapi.adapter.in.web;

import java.util.List;

public record PlayerAnalyticsResponse(
        String puuid,
        String gameName,
        String tagLine,
        String region,
        List<MatchResponse> matches
) {
    public PlayerAnalyticsResponse {
        if (matches != null) {
            matches = List.copyOf(matches);
        }
    }
}
