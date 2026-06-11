package com.analysisgg.modules.riotapi.adapter.out.integration.mapper;

import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotMatchDto;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.ParticipantSummary;
import java.util.List;

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

        List<ParticipantSummary> participants = info.participants().stream()
            .map(RiotMatchMapper::mapParticipant)
            .toList();

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
            targetParticipant.neutralMinionsKilled(),
            targetParticipant.teamPosition(),
            participants
        );
    }

    private static ParticipantSummary mapParticipant(RiotMatchDto.ParticipantDto p) {
        String name = p.riotIdGameName() != null && !p.riotIdGameName().isBlank()
            ? p.riotIdGameName()
            : (p.summonerName() != null ? p.summonerName() : "");
        String tag = p.riotIdTagline() != null ? p.riotIdTagline() : "";

        int primaryStyleId = 0;
        int subStyleId = 0;
        int keystoneId = 0;

        if (p.perks() != null && p.perks().styles() != null) {
            for (var style : p.perks().styles()) {
                if ("primaryStyle".equals(style.description())) {
                    primaryStyleId = style.style();
                    if (style.selections() != null && !style.selections().isEmpty()) {
                        keystoneId = style.selections().get(0).perk();
                    }
                } else if ("subStyle".equals(style.description())) {
                    subStyleId = style.style();
                }
            }
        }

        return new ParticipantSummary(
            p.puuid(),
            name,
            tag,
            p.championId(),
            p.championName(),
            p.win(),
            p.kills(),
            p.deaths(),
            p.assists(),
            p.totalMinionsKilled(),
            p.neutralMinionsKilled(),
            p.teamPosition(),
            p.teamId(),
            p.summoner1Id(),
            p.summoner2Id(),
            p.item0(),
            p.item1(),
            p.item2(),
            p.item3(),
            p.item4(),
            p.item5(),
            p.item6(),
            primaryStyleId,
            subStyleId,
            keystoneId
        );
    }
}
