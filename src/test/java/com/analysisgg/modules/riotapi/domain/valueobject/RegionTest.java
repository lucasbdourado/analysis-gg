package com.analysisgg.modules.riotapi.domain.valueobject;

import com.analysisgg.modules.riotapi.domain.exception.UnsupportedRegionException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RegionTest {

    @ParameterizedTest
    @ValueSource(strings = {"br1", "na1", "euw1", "eune1", "kr"})
    void shouldAcceptWhitelistedRegions(String regionCode) {
        Region region = new Region(regionCode);
        assertThat(region.value()).isEqualTo(regionCode);
    }

    @ParameterizedTest
    @ValueSource(strings = {"BR1", "Kr", "Euw1", "  kr  ", "na1 "})
    void shouldNormalizeAndAcceptRegions(String regionCode) {
        Region region = new Region(regionCode);
        assertThat(region.value()).isEqualTo(regionCode.trim().toLowerCase());
    }

    @ParameterizedTest
    @ValueSource(strings = {"lan", "las", "", "   ", "na2", "kr1"})
    void shouldRejectUnsupportedRegions(String regionCode) {
        assertThatThrownBy(() -> new Region(regionCode))
                .isInstanceOf(UnsupportedRegionException.class);
    }

    @Test
    void shouldRejectNullRegion() {
        assertThatThrownBy(() -> new Region(null))
                .isInstanceOf(UnsupportedRegionException.class);
    }
}
