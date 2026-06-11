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
        String teamPosition,
        String riotIdGameName,
        String riotIdTagline,
        String summonerName,
        int teamId,
        int summoner1Id,
        int summoner2Id,
        int item0,
        int item1,
        int item2,
        int item3,
        int item4,
        int item5,
        int item6,
        PerksDto perks
    ) {}

    public record PerksDto(
        List<PerkStyleDto> styles
    ) {}

    public record PerkStyleDto(
        String description,
        List<PerkSelectionDto> selections,
        int style
    ) {}

    public record PerkSelectionDto(
        int perk
    ) {}
}
