package com.analysisgg.modules.riotapi.adapter.out.integration.mapper;

import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotMatchDto;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;

public class RiotMatchMapper {
    public static MatchSummary toDomain(RiotMatchDto dto, String targetPuuid) {
        if (dto == null || dto.metadata() == null || dto.info() == null || dto.info().participants() == null) {
            throw new IllegalArgumentException("Invalid RiotMatchDto payload");
        }
        var matchId = dto.metadata().matchId();
        var info = dto.info();
        
        var targetParticipant = info.participants().stream()
            .filter(p -> p.puuid() != null && p.puuid().equals(targetPuuid))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Target PUUID not found in match participants list"));

        return new MatchSummary(
            matchId,
            info.gameDuration(),
            info.gameCreation(),
            info.queueId(),
            targetParticipant.win(),
            targetParticipant.championId(),
            targetParticipant.championName(),
            targetParticipant.kills(),
            targetParticipant.deaths(),
            targetParticipant.assists(),
            targetParticipant.totalMinionsKilled(),
            targetParticipant.neutralMinionsKilled()
        );
    }
}
