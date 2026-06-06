package com.analysisgg.modules.riotapi.adapter.out.cache;

import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;

public record MatchSummaryCacheKey(String matchId, Puuid puuid, Region region) {
    public MatchSummaryCacheKey {
        if (matchId == null || matchId.isBlank()) {
            throw new IllegalArgumentException("MatchId cannot be null or blank.");
        }
        if (puuid == null) {
            throw new IllegalArgumentException("Puuid cannot be null.");
        }
        if (region == null) {
            throw new IllegalArgumentException("Region cannot be null.");
        }
    }
}
