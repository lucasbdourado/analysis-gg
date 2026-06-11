package com.analysisgg.modules.riotapi.application.usecase;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.Optional;

public class GetMatchDetailUseCase {

    private final RiotApiClientPort riotApiClientPort;
    private final PlayerProfileCachePort playerProfileCachePort;

    public GetMatchDetailUseCase(
            RiotApiClientPort riotApiClientPort,
            PlayerProfileCachePort playerProfileCachePort
    ) {
        this.riotApiClientPort = riotApiClientPort;
        this.playerProfileCachePort = playerProfileCachePort;
    }

    public MatchSummary execute(String matchId, Region region, RiotId riotId) {
        RiotAccount profile = playerProfileCachePort.getProfile(riotId, region)
                .orElseGet(() -> {
                    Puuid resolvedPuuid = riotApiClientPort.resolvePuuid(riotId, region);
                    int profileIconId = 29;
                    long summonerLevel = 1L;
                    try {
                        var summonerDto = riotApiClientPort.fetchSummonerByPuuid(resolvedPuuid, region);
                        profileIconId = summonerDto.profileIconId();
                        summonerLevel = summonerDto.summonerLevel();
                    } catch (Exception e) {
                        // ignore and use fallbacks
                    }
                    RiotAccount newProfile = new RiotAccount(
                            resolvedPuuid.value(),
                            riotId.gameName(),
                            riotId.tagLine(),
                            profileIconId,
                            summonerLevel
                    );
                    playerProfileCachePort.putProfile(riotId, region, newProfile);
                    return newProfile;
                });

        Puuid puuid = new Puuid(profile.puuid());

        return playerProfileCachePort.getMatchSummary(matchId, puuid, region)
                .orElseGet(() -> {
                    MatchSummary summary = riotApiClientPort.fetchMatchDetail(matchId, puuid, region);
                    playerProfileCachePort.putMatchSummary(matchId, puuid, region, summary);
                    return summary;
                });
    }
}
