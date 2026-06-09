package com.analysisgg.modules.riotapi.domain.model;

import java.util.List;

public record RankedQueues(
    RankedQueueSummary soloDuo,
    RankedQueueSummary flex
) {
    public static final String SOLO_DUO_QUEUE_TYPE = "RANKED_SOLO_5x5";
    public static final String FLEX_QUEUE_TYPE = "RANKED_FLEX_SR";

    public RankedQueues {
        if (soloDuo == null) {
            soloDuo = RankedQueueSummary.unranked(SOLO_DUO_QUEUE_TYPE);
        }
        if (flex == null) {
            flex = RankedQueueSummary.unranked(FLEX_QUEUE_TYPE);
        }
    }

    public static RankedQueues unranked() {
        return new RankedQueues(
                RankedQueueSummary.unranked(SOLO_DUO_QUEUE_TYPE),
                RankedQueueSummary.unranked(FLEX_QUEUE_TYPE)
        );
    }

    public static RankedQueues fromEntries(List<RankedQueueSummary> entries) {
        RankedQueueSummary soloDuo = null;
        RankedQueueSummary flex = null;

        if (entries != null) {
            for (RankedQueueSummary entry : entries) {
                if (entry == null || entry.queueType() == null) {
                    continue;
                }

                if (SOLO_DUO_QUEUE_TYPE.equals(entry.queueType())) {
                    soloDuo = entry;
                } else if (FLEX_QUEUE_TYPE.equals(entry.queueType())) {
                    flex = entry;
                }
            }
        }

        return new RankedQueues(soloDuo, flex);
    }
}
