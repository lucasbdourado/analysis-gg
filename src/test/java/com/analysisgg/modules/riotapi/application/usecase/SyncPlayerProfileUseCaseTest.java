package com.analysisgg.modules.riotapi.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.analysisgg.modules.riotapi.application.port.PlayerProfileCachePort;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.PlayerAnalytics;
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
class SyncPlayerProfileUseCaseTest {

    @Mock
    private RiotApiClientPort riotApiClientPort;

    @Mock
    private PlayerProfileCachePort playerProfileCachePort;

    private SyncPlayerProfileUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new SyncPlayerProfileUseCase(riotApiClientPort, playerProfileCachePort);
    }

    @Test
    void shouldReturnCachedProfileAndCachedMatchesWithoutCallingApi() {
        RiotId riotId = new RiotId("Faker", "T111");
        Region region = new Region("kr");
        Puuid puuid = new Puuid("faker-puuid");
        RiotAccount cachedAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine());

        MatchSummary match1 = new MatchSummary("KR_1", 1800, 1000, 420, true, 1, "Jax", 5, 2, 5, 200, 20);
        MatchSummary match2 = new MatchSummary("KR_2", 1500, 2000, 440, false, 2, "Ahri", 2, 6, 4, 150, 10);

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.of(cachedAccount));
        when(riotApiClientPort.fetchMatchIds(puuid, region, 2)).thenReturn(List.of("KR_1", "KR_2"));
        when(playerProfileCachePort.getMatchSummary("KR_1", puuid, region)).thenReturn(Optional.of(match1));
        when(playerProfileCachePort.getMatchSummary("KR_2", puuid, region)).thenReturn(Optional.of(match2));

        PlayerAnalytics analytics = useCase.execute(riotId, region, 2);

        assertThat(analytics.puuid()).isEqualTo(puuid.value());
        assertThat(analytics.gameName()).isEqualTo(riotId.gameName());
        assertThat(analytics.tagLine()).isEqualTo(riotId.tagLine());
        assertThat(analytics.region()).isEqualTo(region.value());
        assertThat(analytics.matches()).containsExactly(match1, match2);

        verifyNoMoreInteractions(riotApiClientPort);
    }

    @Test
    void shouldResolveProfileAndFetchMatchesFromApiOnCacheMisses() {
        RiotId riotId = new RiotId("Faker", "T111");
        Region region = new Region("kr");
        Puuid puuid = new Puuid("faker-puuid");
        RiotAccount resolvedAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine());

        MatchSummary match1 = new MatchSummary("KR_1", 1800, 1000, 420, true, 1, "Jax", 5, 2, 5, 200, 20);

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.empty());
        when(riotApiClientPort.resolvePuuid(riotId, region)).thenReturn(puuid);
        when(riotApiClientPort.fetchMatchIds(puuid, region, 1)).thenReturn(List.of("KR_1"));
        when(playerProfileCachePort.getMatchSummary("KR_1", puuid, region)).thenReturn(Optional.empty());
        when(riotApiClientPort.fetchMatchDetail("KR_1", puuid, region)).thenReturn(match1);

        PlayerAnalytics analytics = useCase.execute(riotId, region, 1);

        assertThat(analytics.matches()).containsExactly(match1);

        verify(playerProfileCachePort).putProfile(riotId, region, resolvedAccount);
        verify(playerProfileCachePort).putMatchSummary("KR_1", puuid, region, match1);
    }

    @Test
    void shouldHandlePartialFailuresGracefully() {
        RiotId riotId = new RiotId("Faker", "T111");
        Region region = new Region("kr");
        Puuid puuid = new Puuid("faker-puuid");
        RiotAccount cachedAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine());

        MatchSummary match1 = new MatchSummary("KR_1", 1800, 1000, 420, true, 1, "Jax", 5, 2, 5, 200, 20);

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.of(cachedAccount));
        when(riotApiClientPort.fetchMatchIds(puuid, region, 2)).thenReturn(List.of("KR_1", "KR_2"));

        // Match 1 is cached
        when(playerProfileCachePort.getMatchSummary("KR_1", puuid, region)).thenReturn(Optional.of(match1));
        // Match 2 is a miss and fails when calling API
        when(playerProfileCachePort.getMatchSummary("KR_2", puuid, region)).thenReturn(Optional.empty());
        when(riotApiClientPort.fetchMatchDetail("KR_2", puuid, region)).thenThrow(new RuntimeException("API error"));

        PlayerAnalytics analytics = useCase.execute(riotId, region, 2);

        // Analytics should contain match1, match2 is gracefully skipped
        assertThat(analytics.matches()).containsExactly(match1);
    }

    @Test
    void shouldFetchMatchDetailsInParallel() {
        RiotId riotId = new RiotId("Faker", "T111");
        Region region = new Region("kr");
        Puuid puuid = new Puuid("faker-puuid");
        RiotAccount cachedAccount = new RiotAccount(puuid.value(), riotId.gameName(), riotId.tagLine());

        MatchSummary match1 = new MatchSummary("KR_1", 1800, 1000, 420, true, 1, "Jax", 5, 2, 5, 200, 20);
        MatchSummary match2 = new MatchSummary("KR_2", 1500, 2000, 440, false, 2, "Ahri", 2, 6, 4, 150, 10);
        MatchSummary match3 = new MatchSummary("KR_3", 1600, 3000, 420, true, 3, "Zed", 10, 1, 3, 180, 15);

        when(playerProfileCachePort.getProfile(riotId, region)).thenReturn(Optional.of(cachedAccount));
        when(riotApiClientPort.fetchMatchIds(puuid, region, 3)).thenReturn(List.of("KR_1", "KR_2", "KR_3"));

        when(playerProfileCachePort.getMatchSummary(anyString(), eq(puuid), eq(region))).thenReturn(Optional.empty());

        // Introduce artificial delays
        when(riotApiClientPort.fetchMatchDetail("KR_1", puuid, region)).thenAnswer(inv -> {
            Thread.sleep(100);
            return match1;
        });
        when(riotApiClientPort.fetchMatchDetail("KR_2", puuid, region)).thenAnswer(inv -> {
            Thread.sleep(100);
            return match2;
        });
        when(riotApiClientPort.fetchMatchDetail("KR_3", puuid, region)).thenAnswer(inv -> {
            Thread.sleep(100);
            return match3;
        });

        long start = System.currentTimeMillis();
        PlayerAnalytics analytics = useCase.execute(riotId, region, 3);
        long duration = System.currentTimeMillis() - start;

        // If executed sequentially, total time would be >= 300ms.
        // Parallel execution with virtual threads should complete in ~100-200ms.
        assertThat(duration).isLessThan(250);
        assertThat(analytics.matches()).containsExactlyInAnyOrder(match1, match2, match3);
    }
}
