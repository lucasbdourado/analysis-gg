package com.analysisgg.modules.riotapi.application.port;

import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RankedQueueSummary;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.List;

public interface RiotApiClientPort {
    /**
     * Resolves a player's PUUID based on their Riot ID and Region.
     *
     * @param riotId the player's game name and tagline
     * @param region the platform region (e.g., br1)
     * @return the resolved Puuid
     * @throws com.analysisgg.modules.riotapi.domain.exception.PlayerNotFoundException if the player is not found
     * @throws com.analysisgg.modules.riotapi.domain.exception.RiotApiException for other external API errors
     */
    Puuid resolvePuuid(RiotId riotId, Region region);

    /**
     * Fetches recent ranked Solo/Duo and Flex match IDs for the given player.
     *
     * @param puuid the player's PUUID
     * @param region the platform region (e.g., br1)
     * @param count the number of matches to retrieve
     * @return a merged, deduplicated, and sorted list of match ID strings
     * @throws com.analysisgg.modules.riotapi.domain.exception.RiotApiException if the external API returns an error
     */
    List<String> fetchMatchIds(Puuid puuid, Region region, int count);

    /**
     * Fetches recent match IDs for the given player filtered by queue.
     *
     * @param puuid the player's PUUID
     * @param region the platform region (e.g., br1)
     * @param count the number of matches to retrieve
     * @param queue the queue ID to filter by (optional)
     * @return a merged, deduplicated, and sorted list of match ID strings
     * @throws com.analysisgg.modules.riotapi.domain.exception.RiotApiException if the external API returns an error
     */
    List<String> fetchMatchIds(Puuid puuid, Region region, int count, Integer queue);

    /**
     * Fetches current ranked League-v4 queue entries for the given player.
     *
     * @param puuid the player's PUUID
     * @param region the platform region (e.g., br1)
     * @return Riot ranked entries mapped to domain queue summaries
     * @throws com.analysisgg.modules.riotapi.domain.exception.RiotApiException if the external API returns an error
     */
    List<RankedQueueSummary> fetchRankedEntries(Puuid puuid, Region region);

    /**
     * Fetches details of a specific match and maps it to a MatchSummary for the target player.
     *
     * @param matchId the match ID string
     * @param targetPuuid the PUUID of the player we want to get stats for
     * @param region the platform region (e.g., br1)
     * @return the mapped MatchSummary domain model
     * @throws com.analysisgg.modules.riotapi.domain.exception.RiotApiException if the external API returns an error
     */
    MatchSummary fetchMatchDetail(String matchId, Puuid targetPuuid, Region region);
}
