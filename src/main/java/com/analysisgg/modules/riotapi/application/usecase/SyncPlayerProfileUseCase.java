package com.analysisgg.modules.riotapi.application.usecase;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class SyncPlayerProfileUseCase {

    private static final System.Logger LOGGER = System.getLogger(SyncPlayerProfileUseCase.class.getName());

    private final RiotApiClientPort riotApiClientPort;
    private final PlayerProfileCachePort playerProfileCachePort;

    public SyncPlayerProfileUseCase(
            RiotApiClientPort riotApiClientPort,
            PlayerProfileCachePort playerProfileCachePort
    ) {
        this.riotApiClientPort = riotApiClientPort;
        this.playerProfileCachePort = playerProfileCachePort;
    }

    public PlayerAnalytics execute(RiotId riotId, Region region, int count) {
        return execute(riotId, region, count, null);
    }

    public PlayerAnalytics execute(RiotId riotId, Region region, int count, Integer queue) {
        RiotAccount profile = playerProfileCachePort.getProfile(riotId, region)
                .orElseGet(() -> {
                    Puuid resolvedPuuid = riotApiClientPort.resolvePuuid(riotId, region);
                    RiotAccount newProfile = new RiotAccount(resolvedPuuid.value(), riotId.gameName(), riotId.tagLine());
                    playerProfileCachePort.putProfile(riotId, region, newProfile);
                    return newProfile;
                });

        Puuid puuid = new Puuid(profile.puuid());
        List<String> matchIds;
        if (queue != null) {
            matchIds = riotApiClientPort.fetchMatchIds(puuid, region, count, queue);
        } else {
            matchIds = riotApiClientPort.fetchMatchIds(puuid, region, count);
        }

        List<Future<MatchSummary>> futures = new ArrayList<>();
        java.util.concurrent.Semaphore semaphore = new java.util.concurrent.Semaphore(3);
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (String matchId : matchIds) {
                Optional<MatchSummary> cached = playerProfileCachePort.getMatchSummary(matchId, puuid, region);
                if (cached.isPresent()) {
                    futures.add(CompletableFuture.completedFuture(cached.get()));
                } else {
                    futures.add(executor.submit(() -> {
                        try {
                            semaphore.acquire();
                            try {
                                MatchSummary summary = riotApiClientPort.fetchMatchDetail(matchId, puuid, region);
                                playerProfileCachePort.putMatchSummary(matchId, puuid, region, summary);
                                return summary;
                            } finally {
                                semaphore.release();
                            }
                        } catch (Exception e) {
                            LOGGER.log(System.Logger.Level.WARNING, "Failed to fetch details for match " + matchId, e);
                            return null;
                        }
                    }));
                }
            }
        }

        List<MatchSummary> matches = new ArrayList<>();
        for (Future<MatchSummary> future : futures) {
            try {
                MatchSummary summary = future.get();
                if (summary != null) {
                    matches.add(summary);
                }
            } catch (Exception e) {
                LOGGER.log(System.Logger.Level.ERROR, "Unexpected error retrieving match detail future", e);
            }
        }

        return new PlayerAnalytics(
                profile.puuid(),
                profile.gameName(),
                profile.tagLine(),
                region.value(),
                matches
        );
    }
}
