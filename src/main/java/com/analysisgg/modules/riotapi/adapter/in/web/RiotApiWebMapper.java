package com.analysisgg.modules.riotapi.adapter.in.web;

import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
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

        return new PlayerAnalyticsResponse(
                domain.puuid(),
                domain.gameName(),
                domain.tagLine(),
                domain.region(),
                matches
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
                domain.neutralMinionsKilled()
        );
    }
}
