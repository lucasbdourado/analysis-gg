package com.analysisgg.modules.riotapi.application.port;

import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.Optional;

public interface PlayerProfileCachePort {

    /**
     * Retrieves a cached player profile.
     *
     * @param riotId the Riot ID (game name and tagline)
     * @param region the region
     * @return an Optional containing the cached RiotAccount, or empty if not cached
     */
    Optional<RiotAccount> getProfile(RiotId riotId, Region region);

    /**
     * Caches a player profile.
     *
     * @param riotId the Riot ID (game name and tagline)
     * @param region the region
     * @param profile the RiotAccount profile to cache
     */
    void putProfile(RiotId riotId, Region region, RiotAccount profile);

    /**
     * Evicts a player profile from the cache.
     *
     * @param riotId the Riot ID (game name and tagline)
     * @param region the region
     */
    void evictProfile(RiotId riotId, Region region);

    /**
     * Retrieves a cached match summary.
     *
     * @param matchId the match ID
     * @param puuid the player's PUUID
     * @param region the region
     * @return an Optional containing the cached MatchSummary, or empty if not cached
     */
    Optional<MatchSummary> getMatchSummary(String matchId, Puuid puuid, Region region);

    /**
     * Caches a match summary.
     *
     * @param matchId the match ID
     * @param puuid the player's PUUID
     * @param region the region
     * @param matchSummary the MatchSummary to cache
     */
    void putMatchSummary(String matchId, Puuid puuid, Region region, MatchSummary matchSummary);

    /**
     * Evicts a match summary from the cache.
     *
     * @param matchId the match ID
     * @param puuid the player's PUUID
     * @param region the region
     */
    void evictMatchSummary(String matchId, Puuid puuid, Region region);

    /**
     * Clears all entries from both caches.
     */
    void clear();
}
