package com.analysisgg.modules.riotapi.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotSummonerDto;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RiotAccount;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GetMatchDetailUseCaseTest {

    @Mock
    private RiotApiClientPort riotApiClientPort;

    @Mock
    private PlayerProfileCachePort playerProfileCachePort;

    private GetMatchDetailUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new GetMatchDetailUseCase(riotApiClientPort, playerProfileCachePort);
    }

    @Test
    void shouldReturnCachedMatchSummaryOnCacheHit() {
        RiotId riotId = new RiotId("Lucas", "BR1");
        Region region = new Region("br1");
        Puuid puuid = new Puuid("lucas-puuid");
        RiotAccount cachedAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine(), 29, 150L);

        MatchSummary match = new MatchSummary(
                "BR1_123", 1800, 1000, 420, true, 103, "Ahri",
                8, 2, 10, 180, 10, "MIDDLE", List.of()
        );

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.of(cachedAccount));
        when(playerProfileCachePort.getMatchSummary("BR1_123", puuid, region)).thenReturn(Optional.of(match));

        MatchSummary result = useCase.execute("BR1_123", region, riotId);

        assertThat(result).isEqualTo(match);
        verify(playerProfileCachePort).getProfile(riotId, region);
        verify(playerProfileCachePort).getMatchSummary("BR1_123", puuid, region);
        verifyNoInteractions(riotApiClientPort);
    }

    @Test
    void shouldFetchFromApiAndCacheOnCacheMiss() {
        RiotId riotId = new RiotId("Lucas", "BR1");
        Region region = new Region("br1");
        Puuid puuid = new Puuid("lucas-puuid");
        RiotSummonerDto summonerDto = new RiotSummonerDto("id-123", "acc-123", puuid.value(), 1234, 0L, 150L);
        RiotAccount newAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine(), 1234, 150L);

        MatchSummary match = new MatchSummary(
                "BR1_123", 1800, 1000, 420, true, 103, "Ahri",
                8, 2, 10, 180, 10, "MIDDLE", List.of()
        );

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.empty());
        when(riotApiClientPort.resolvePuuid(riotId, region)).thenReturn(puuid);
        when(riotApiClientPort.fetchSummonerByPuuid(puuid, region)).thenReturn(summonerDto);
        when(playerProfileCachePort.getMatchSummary("BR1_123", puuid, region)).thenReturn(Optional.empty());
        when(riotApiClientPort.fetchMatchDetail("BR1_123", puuid, region)).thenReturn(match);

        MatchSummary result = useCase.execute("BR1_123", region, riotId);

        assertThat(result).isEqualTo(match);
        verify(playerProfileCachePort).putProfile(riotId, region, newAccount);
        verify(playerProfileCachePort).putMatchSummary("BR1_123", puuid, region, match);
    }
}
