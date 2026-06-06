package com.analysisgg.modules.riotapi.domain.model;

import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DomainModelsTest {

    @Test
    void shouldCreateRiotAccountCorrectly() {
        RiotAccount account = new RiotAccount("puuid-123", "Faker", "KR1");
        assertThat(account.puuid()).isEqualTo("puuid-123");
        assertThat(account.gameName()).isEqualTo("Faker");
        assertThat(account.tagLine()).isEqualTo("KR1");
    }

    @Test
    void shouldCreateMatchSummaryCorrectly() {
        MatchSummary match = new MatchSummary(
            "BR1_12345",
            1800L,
            1620000000000L,
            420,
            true,
            266,
            "Aatrox",
            5,
            2,
            10,
            180,
            20
        );

        assertThat(match.matchId()).isEqualTo("BR1_12345");
        assertThat(match.gameDuration()).isEqualTo(1800L);
        assertThat(match.gameCreation()).isEqualTo(1620000000000L);
        assertThat(match.queueId()).isEqualTo(420);
        assertThat(match.win()).isTrue();
        assertThat(match.championId()).isEqualTo(266);
        assertThat(match.championName()).isEqualTo("Aatrox");
        assertThat(match.kills()).isEqualTo(5);
        assertThat(match.deaths()).isEqualTo(2);
        assertThat(match.assists()).isEqualTo(10);
        assertThat(match.totalMinionsKilled()).isEqualTo(180);
        assertThat(match.neutralMinionsKilled()).isEqualTo(20);
    }

    @Test
    void shouldCreatePlayerAnalyticsCorrectlyAndEnforceImmutability() {
        List<MatchSummary> matches = new ArrayList<>();
        matches.add(new MatchSummary(
            "BR1_12345", 1800L, 1620000000000L, 420, true, 266, "Aatrox", 5, 2, 10, 180, 20
        ));

        PlayerAnalytics analytics = new PlayerAnalytics(
            "puuid-123",
            "Faker",
            "KR1",
            "kr",
            matches
        );

        assertThat(analytics.puuid()).isEqualTo("puuid-123");
        assertThat(analytics.gameName()).isEqualTo("Faker");
        assertThat(analytics.tagLine()).isEqualTo("KR1");
        assertThat(analytics.region()).isEqualTo("kr");
        assertThat(analytics.matches()).hasSize(1);

        // Ensure the list is immutable/copied defensively
        assertThatThrownBy(() -> analytics.matches().add(new MatchSummary(
            "BR1_67890", 1800L, 1620000000000L, 420, false, 266, "Aatrox", 1, 5, 2, 150, 10
        ))).isInstanceOf(UnsupportedOperationException.class);
    }
}
