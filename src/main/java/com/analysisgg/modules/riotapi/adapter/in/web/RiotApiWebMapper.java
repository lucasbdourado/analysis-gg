package com.analysisgg.modules.riotapi.adapter.in.web;

import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.PastSeasonRank;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
import com.analysisgg.modules.riotapi.domain.model.RankedQueueSummary;
import com.analysisgg.modules.riotapi.domain.model.RankedQueues;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RiotApiWebMapper {

    public PlayerAnalyticsResponse toResponse(PlayerAnalytics domain) {
        if (domain == null) {
            return null;
        }
        
        List<MatchResponse> matches = domain.matches() != null
                ? domain.matches().stream().map(this::toMatchResponse).toList()
                : Collections.emptyList();

        List<PastSeasonRankResponse> pastSeasonRanks = domain.pastSeasonRanks() != null
                ? domain.pastSeasonRanks().stream().map(this::toPastSeasonRankResponse).toList()
                : Collections.emptyList();

        return new PlayerAnalyticsResponse(
                domain.puuid(),
                domain.gameName(),
                domain.tagLine(),
                domain.region(),
                domain.profileIconId(),
                domain.summonerLevel(),
                toRankedQueuesResponse(domain.rankedQueues()),
                matches,
                pastSeasonRanks
        );
    }

    public RankedQueuesResponse toRankedQueuesResponse(RankedQueues domain) {
        if (domain == null) {
            return null;
        }

        return new RankedQueuesResponse(
                toRankedQueueSummaryResponse(domain.soloDuo()),
                toRankedQueueSummaryResponse(domain.flex())
        );
    }

    public RankedQueueSummaryResponse toRankedQueueSummaryResponse(RankedQueueSummary domain) {
        if (domain == null) {
            return null;
        }

        return new RankedQueueSummaryResponse(
                domain.queueType(),
                domain.tier(),
                domain.rank(),
                domain.leaguePoints(),
                domain.wins(),
                domain.losses(),
                domain.winRate()
        );
    }

    public MatchResponse toMatchResponse(MatchSummary domain) {
        if (domain == null) {
            return null;
        }

        return new MatchResponse(
                domain.matchId(),
                domain.gameDuration(),
                domain.gameCreation(),
                domain.queueId(),
                domain.win(),
                domain.championId(),
                domain.championName(),
                domain.kills(),
                domain.deaths(),
                domain.assists(),
                domain.totalMinionsKilled(),
                domain.neutralMinionsKilled(),
                domain.teamPosition()
        );
    }

    public PastSeasonRankResponse toPastSeasonRankResponse(PastSeasonRank domain) {
        if (domain == null) {
            return null;
        }
        return new PastSeasonRankResponse(
                domain.season(),
                domain.tier(),
                domain.rank()
        );
    }
}
