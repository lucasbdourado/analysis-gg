package com.analysisgg.modules.riotapi.adapter.out.cache;

import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;

public record ProfileCacheKey(RiotId riotId, Region region) {
    public ProfileCacheKey {
        if (riotId == null) {
            throw new IllegalArgumentException("RiotId cannot be null.");
        }
        if (region == null) {
            throw new IllegalArgumentException("Region cannot be null.");
        }
    }
}
