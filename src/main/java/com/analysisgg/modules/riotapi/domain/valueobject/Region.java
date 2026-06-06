package com.analysisgg.modules.riotapi.domain.valueobject;

import com.analysisgg.modules.riotapi.domain.exception.UnsupportedRegionException;
import java.util.Set;

public record Region(String value) {
    private static final Set<String> WHITELIST = Set.of("br1", "na1", "euw1", "eune1", "kr");

    public Region {
        if (value == null) {
            throw new UnsupportedRegionException("Region cannot be null.");
        }
        value = value.trim().toLowerCase();
        if (!WHITELIST.contains(value)) {
            throw new UnsupportedRegionException("Unsupported region: " + value);
        }
    }
}
