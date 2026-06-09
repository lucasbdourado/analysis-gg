package com.analysisgg.modules.riotapi.domain.model;

public record RankedQueueSummary(
    String queueType,
    String tier,
    String rank,
    Integer leaguePoints,
    Integer wins,
    Integer losses,
    Double winRate
) {
    public static RankedQueueSummary ranked(
            String queueType,
            String tier,
            String rank,
            Integer leaguePoints,
            Integer wins,
            Integer losses
    ) {
        return new RankedQueueSummary(
                queueType,
                tier,
                rank,
                leaguePoints,
                wins,
                losses,
                calculateWinRate(wins, losses)
        );
    }

    public static RankedQueueSummary unranked(String queueType) {
        return new RankedQueueSummary(queueType, null, null, null, null, null, null);
    }

    private static Double calculateWinRate(Integer wins, Integer losses) {
        if (wins == null || losses == null) {
            return null;
        }

        int total = wins + losses;
        if (total <= 0) {
            return null;
        }

        return wins * 100.0 / total;
    }
}
