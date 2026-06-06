package com.analysisgg.modules.riotapi.domain.model;

import java.util.List;

public record PlayerAnalytics(
    String puuid,
    String gameName,
    String tagLine,
    String region,
    List<MatchSummary> matches
) {
    public PlayerAnalytics {
        if (matches != null) {
            matches = List.copyOf(matches);
        }
    }
}
