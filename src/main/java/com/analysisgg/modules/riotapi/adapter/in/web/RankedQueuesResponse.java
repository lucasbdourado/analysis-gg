package com.analysisgg.modules.riotapi.adapter.in.web;

public record RankedQueuesResponse(
        RankedQueueSummaryResponse soloDuo,
        RankedQueueSummaryResponse flex
) {
}
