package com.analysisgg.modules.riotapi.adapter.out.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.analysisgg.modules.riotapi.domain.exception.PlayerNotFoundException;
import com.analysisgg.modules.riotapi.domain.exception.RateLimitExceededException;
import com.analysisgg.modules.riotapi.domain.exception.RiotApiException;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.model.RankedQueueSummary;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class RiotApiClientAdapterTest {

    private RiotApiClientAdapter adapter;
    private MockRestServiceServer server;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        adapter = new RiotApiClientAdapter("test-token", builder);
    }

    @Test
    void shouldResolvePuuidSuccessfully() {
        String responseJson = """
                {
                  "puuid": "puuid-123",
                  "gameName": "Lucas",
                  "tagLine": "BR1"
                }
                """;

        server.expect(requestTo("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .andExpect(header("X-Riot-Token", "test-token"))
                .andRespond(withSuccess(responseJson, MediaType.APPLICATION_JSON));

        Puuid puuid = adapter.resolvePuuid(new RiotId("Lucas", "BR1"), new Region("br1"));

        assertThat(puuid).isNotNull();
        assertThat(puuid.value()).isEqualTo("puuid-123");
        server.verify();
    }

    @Test
    void shouldThrowPlayerNotFoundExceptionOn404Profile() {
        server.expect(requestTo("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertThatThrownBy(() -> adapter.resolvePuuid(new RiotId("Lucas", "BR1"), new Region("br1")))
                .isInstanceOf(PlayerNotFoundException.class)
                .hasMessageContaining("Player Lucas#BR1 not found");
        server.verify();
    }

    @Test
    void shouldThrowRateLimitExceptionOn429() {
        server.expect(org.springframework.test.web.client.ExpectedCount.times(3), requestTo("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        assertThatThrownBy(() -> adapter.resolvePuuid(new RiotId("Lucas", "BR1"), new Region("br1")))
                .isInstanceOf(RateLimitExceededException.class)
                .hasMessageContaining("Rate limit exceeded");
        server.verify();
    }

    @Test
    void shouldThrowRiotApiExceptionOnOtherErrors() {
        server.expect(requestTo("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        assertThatThrownBy(() -> adapter.resolvePuuid(new RiotId("Lucas", "BR1"), new Region("br1")))
                .isInstanceOf(RiotApiException.class)
                .hasMessageContaining("Riot API error when resolving PUUID");
        server.verify();
    }

    @Test
    void shouldFetchMatchIds() {
        String matchIdsJson = "[\"BR1_3\", \"BR1_2\", \"BR1_1\"]";

        server.expect(requestTo("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/puuid-123/ids?start=0&count=5"))
                .andRespond(withSuccess(matchIdsJson, MediaType.APPLICATION_JSON));

        List<String> matchIds = adapter.fetchMatchIds(new Puuid("puuid-123"), new Region("br1"), 5);

        assertThat(matchIds).containsExactly("BR1_3", "BR1_2", "BR1_1");
        server.verify();
    }

    @Test
    void shouldFetchRankedEntriesUsingPlatformHostAndMapWinRate() {
        String rankedEntriesJson = """
                [
                  {
                    "queueType": "RANKED_SOLO_5x5",
                    "tier": "GOLD",
                    "rank": "II",
                    "leaguePoints": 37,
                    "wins": 54,
                    "losses": 48
                  },
                  {
                    "queueType": "RANKED_FLEX_SR",
                    "tier": "SILVER",
                    "rank": "I",
                    "leaguePoints": 12,
                    "wins": 10,
                    "losses": 0
                  }
                ]
                """;

        server.expect(requestTo("https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/puuid-123"))
                .andExpect(header("X-Riot-Token", "test-token"))
                .andRespond(withSuccess(rankedEntriesJson, MediaType.APPLICATION_JSON));

        List<RankedQueueSummary> entries = adapter.fetchRankedEntries(new Puuid("puuid-123"), new Region("br1"));

        assertThat(entries).hasSize(2);
        assertThat(entries.get(0).queueType()).isEqualTo("RANKED_SOLO_5x5");
        assertThat(entries.get(0).tier()).isEqualTo("GOLD");
        assertThat(entries.get(0).rank()).isEqualTo("II");
        assertThat(entries.get(0).leaguePoints()).isEqualTo(37);
        assertThat(entries.get(0).wins()).isEqualTo(54);
        assertThat(entries.get(0).losses()).isEqualTo(48);
        assertThat(entries.get(0).winRate()).isEqualTo(54 * 100.0 / 102);
        assertThat(entries.get(1).winRate()).isEqualTo(100.0);
        server.verify();
    }

    @Test
    void shouldFetchMatchDetailsAndMapToDomain() {
        String matchDetailJson = """
                {
                  "metadata": {
                    "matchId": "BR1_3",
                    "participants": ["puuid-123", "other-puuid"]
                  },
                  "info": {
                    "gameCreation": 1785984000000,
                    "gameDuration": 1800,
                    "queueId": 420,
                    "participants": [
                      {
                        "puuid": "puuid-123",
                        "championId": 103,
                        "championName": "Ahri",
                        "win": true,
                        "kills": 8,
                        "deaths": 2,
                        "assists": 12,
                        "totalMinionsKilled": 180,
                        "neutralMinionsKilled": 12
                      },
                      {
                        "puuid": "other-puuid",
                        "championId": 81,
                        "championName": "Ezreal",
                        "win": false,
                        "kills": 1,
                        "deaths": 8,
                        "assists": 2,
                        "totalMinionsKilled": 150,
                        "neutralMinionsKilled": 0
                      }
                    ]
                  }
                }
                """;

        server.expect(requestTo("https://americas.api.riotgames.com/lol/match/v5/matches/BR1_3"))
                .andRespond(withSuccess(matchDetailJson, MediaType.APPLICATION_JSON));

        MatchSummary summary = adapter.fetchMatchDetail("BR1_3", new Puuid("puuid-123"), new Region("br1"));

        assertThat(summary).isNotNull();
        assertThat(summary.matchId()).isEqualTo("BR1_3");
        assertThat(summary.gameDuration()).isEqualTo(1800);
        assertThat(summary.gameCreation()).isEqualTo(1785984000000L);
        assertThat(summary.queueId()).isEqualTo(420);
        assertThat(summary.win()).isTrue();
        assertThat(summary.championId()).isEqualTo(103);
        assertThat(summary.championName()).isEqualTo("Ahri");
        assertThat(summary.kills()).isEqualTo(8);
        assertThat(summary.deaths()).isEqualTo(2);
        assertThat(summary.assists()).isEqualTo(12);
        assertThat(summary.totalMinionsKilled()).isEqualTo(180);
        assertThat(summary.neutralMinionsKilled()).isEqualTo(12);
        server.verify();
    }
}
