package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

import java.util.List;

public record RiotMatchDto(
    MetadataDto metadata,
    InfoDto info
) {
    public record MetadataDto(
        String matchId,
        List<String> participants
    ) {}

    public record InfoDto(
        long gameCreation,
        long gameDuration,
        int queueId,
        List<ParticipantDto> participants
    ) {}

    public record ParticipantDto(
        String puuid,
        int championId,
        String championName,
        boolean win,
        int kills,
        int deaths,
        int assists,
        int totalMinionsKilled,
        int neutralMinionsKilled,
        String teamPosition
    ) {}
}
