package com.analysisgg.modules.riotapi.adapter.out.cache;

import static org.assertj.core.api.Assertions.assertThat;

import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CaffeineCacheAdapterTest {

    private Cache<ProfileCacheKey, RiotAccount> playerProfileCache;
    private Cache<MatchSummaryCacheKey, MatchSummary> matchSummaryCache;
    private CaffeineCacheAdapter adapter;

    @BeforeEach
    void setUp() {
        playerProfileCache = Caffeine.newBuilder()
                .maximumSize(1000)
                .build();

        matchSummaryCache = Caffeine.newBuilder()
                .maximumSize(10000)
                .build();

        adapter = new CaffeineCacheAdapter(playerProfileCache, matchSummaryCache);
    }

    @Test
    void shouldReturnEmptyWhenProfileCacheMiss() {
        RiotId riotId = new RiotId("Hide on bush", "KR1");
        Region region = new Region("kr");

        Optional<RiotAccount> result = adapter.getProfile(riotId, region);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnProfileOnCacheHit() {
        RiotId riotId = new RiotId("Hide on bush", "KR1");
        Region region = new Region("kr");
        RiotAccount account = new RiotAccount("some-puuid", "Hide on bush", "KR1");

        adapter.putProfile(riotId, region, account);
        Optional<RiotAccount> result = adapter.getProfile(riotId, region);

        assertThat(result).isPresent().contains(account);
    }

    @Test
    void shouldEvictProfile() {
        RiotId riotId = new RiotId("Hide on bush", "KR1");
        Region region = new Region("kr");
        RiotAccount account = new RiotAccount("some-puuid", "Hide on bush", "KR1");

        adapter.putProfile(riotId, region, account);
        adapter.evictProfile(riotId, region);
        Optional<RiotAccount> result = adapter.getProfile(riotId, region);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnEmptyWhenMatchSummaryCacheMiss() {
        String matchId = "BR1_12345";
        Puuid puuid = new Puuid("some-puuid");
        Region region = new Region("br1");

        Optional<MatchSummary> result = adapter.getMatchSummary(matchId, puuid, region);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnMatchSummaryOnCacheHit() {
        String matchId = "BR1_12345";
        Puuid puuid = new Puuid("some-puuid");
        Region region = new Region("br1");
        MatchSummary summary = new MatchSummary(
                matchId, 1800L, 1785984000000L, 420, true,
                103, "Ahri", 8, 2, 12, 180, 12, "MIDDLE", java.util.List.of()
        );

        adapter.putMatchSummary(matchId, puuid, region, summary);
        Optional<MatchSummary> result = adapter.getMatchSummary(matchId, puuid, region);

        assertThat(result).isPresent().contains(summary);
    }

    @Test
    void shouldEvictMatchSummary() {
        String matchId = "BR1_12345";
        Puuid puuid = new Puuid("some-puuid");
        Region region = new Region("br1");
        MatchSummary summary = new MatchSummary(
                matchId, 1800L, 1785984000000L, 420, true,
                103, "Ahri", 8, 2, 12, 180, 12, "MIDDLE", java.util.List.of()
        );

        adapter.putMatchSummary(matchId, puuid, region, summary);
        adapter.evictMatchSummary(matchId, puuid, region);
        Optional<MatchSummary> result = adapter.getMatchSummary(matchId, puuid, region);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldClearAllCaches() {
        RiotId riotId = new RiotId("Hide on bush", "KR1");
        Region region = new Region("kr");
        RiotAccount account = new RiotAccount("some-puuid", "Hide on bush", "KR1");
        adapter.putProfile(riotId, region, account);

        String matchId = "BR1_12345";
        Puuid puuid = new Puuid("some-puuid");
        Region regionBr = new Region("br1");
        MatchSummary summary = new MatchSummary(
                matchId, 1800L, 1785984000000L, 420, true,
                103, "Ahri", 8, 2, 12, 180, 12, "MIDDLE", java.util.List.of()
        );
        adapter.putMatchSummary(matchId, puuid, regionBr, summary);

        adapter.clear();

        assertThat(adapter.getProfile(riotId, region)).isEmpty();
        assertThat(adapter.getMatchSummary(matchId, puuid, regionBr)).isEmpty();
    }

    @Test
    void shouldEvictBasedOnMaximumSizeForProfiles() {
        Cache<ProfileCacheKey, RiotAccount> testProfileCache = Caffeine.newBuilder()
                .maximumSize(2)
                .build();
        CaffeineCacheAdapter testAdapter = new CaffeineCacheAdapter(testProfileCache, matchSummaryCache);

        RiotId id1 = new RiotId("PlayerOne", "BR1");
        RiotId id2 = new RiotId("PlayerTwo", "BR1");
        RiotId id3 = new RiotId("PlayerThree", "BR1");
        Region region = new Region("br1");

        testAdapter.putProfile(id1, region, new RiotAccount("p1", "PlayerOne", "BR1"));
        testAdapter.putProfile(id2, region, new RiotAccount("p2", "PlayerTwo", "BR1"));
        testAdapter.putProfile(id3, region, new RiotAccount("p3", "PlayerThree", "BR1"));

        testProfileCache.cleanUp();

        long cachedCount = testProfileCache.estimatedSize();
        assertThat(cachedCount).isLessThanOrEqualTo(2);
    }
}
