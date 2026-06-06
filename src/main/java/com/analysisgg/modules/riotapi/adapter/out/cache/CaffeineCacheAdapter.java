package com.analysisgg.modules.riotapi.adapter.out.cache;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import com.github.benmanes.caffeine.cache.Cache;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class CaffeineCacheAdapter implements PlayerProfileCachePort {

    private final Cache<ProfileCacheKey, RiotAccount> playerProfileCache;
    private final Cache<MatchSummaryCacheKey, MatchSummary> matchSummaryCache;

    public CaffeineCacheAdapter(
            Cache<ProfileCacheKey, RiotAccount> playerProfileCache,
            Cache<MatchSummaryCacheKey, MatchSummary> matchSummaryCache) {
        this.playerProfileCache = playerProfileCache;
        this.matchSummaryCache = matchSummaryCache;
    }

    @Override
    public Optional<RiotAccount> getProfile(RiotId riotId, Region region) {
        ProfileCacheKey key = new ProfileCacheKey(riotId, region);
        return Optional.ofNullable(playerProfileCache.getIfPresent(key));
    }

    @Override
    public void putProfile(RiotId riotId, Region region, RiotAccount profile) {
        ProfileCacheKey key = new ProfileCacheKey(riotId, region);
        playerProfileCache.put(key, profile);
    }

    @Override
    public void evictProfile(RiotId riotId, Region region) {
        ProfileCacheKey key = new ProfileCacheKey(riotId, region);
        playerProfileCache.invalidate(key);
    }

    @Override
    public Optional<MatchSummary> getMatchSummary(String matchId, Puuid puuid, Region region) {
        MatchSummaryCacheKey key = new MatchSummaryCacheKey(matchId, puuid, region);
        return Optional.ofNullable(matchSummaryCache.getIfPresent(key));
    }

    @Override
    public void putMatchSummary(String matchId, Puuid puuid, Region region, MatchSummary matchSummary) {
        MatchSummaryCacheKey key = new MatchSummaryCacheKey(matchId, puuid, region);
        matchSummaryCache.put(key, matchSummary);
    }

    @Override
    public void evictMatchSummary(String matchId, Puuid puuid, Region region) {
        MatchSummaryCacheKey key = new MatchSummaryCacheKey(matchId, puuid, region);
        matchSummaryCache.invalidate(key);
    }

    @Override
    public void clear() {
        playerProfileCache.invalidateAll();
        matchSummaryCache.invalidateAll();
    }
}
