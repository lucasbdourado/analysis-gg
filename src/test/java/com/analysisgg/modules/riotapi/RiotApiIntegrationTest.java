package com.analysisgg.modules.riotapi;

import com.analysisgg.modules.riotapi.adapter.out.cache.CaffeineCacheAdapter;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.net.URI;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RiotApiIntegrationTest {

    private static final WireMockServer wireMockServer = new WireMockServer(
            WireMockConfiguration.wireMockConfig().dynamicPort()
    );

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CaffeineCacheAdapter cacheAdapter;

    @BeforeAll
    static void startWireMock() {
        wireMockServer.start();
        WireMock.configureFor("localhost", wireMockServer.port());
    }

    @AfterAll
    static void stopWireMock() {
        wireMockServer.stop();
    }

    @BeforeEach
    void setUp() {
        cacheAdapter.clear();
        wireMockServer.resetAll();
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        public RestClientCustomizer restClientCustomizer() {
            return restClientBuilder -> restClientBuilder.requestInterceptor((request, body, execution) -> {
                URI originalUri = request.getURI();
                if ("https".equals(originalUri.getScheme())) {
                    String newUriString = originalUri.toString().replace("https://", "http://localhost:" + wireMockServer.port() + "/");
                    URI newUri = URI.create(newUriString);
                    HttpRequestWrapper wrappedRequest = new HttpRequestWrapper(request) {
                        @Override
                        public URI getURI() {
                            return newUri;
                        }
                    };
                    return execution.execute(wrappedRequest, body);
                }
                return execution.execute(request, body);
            });
        }
    }

    @Test
    void shouldCachePlayerProfileAndMatchDetailsOnSubsequentRequests() throws Exception {
        // Stub profile lookup
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"puuid\":\"lucas-puuid-123\",\"gameName\":\"Lucas\",\"tagLine\":\"BR1\"}")));

        // Stub match IDs fetch
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/by-puuid/lucas-puuid-123/ids?start=0&count=2"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("[\"BR1_102\", \"BR1_101\"]")));

        stubRankedEntries();

        // Stub match details fetch
        String matchDetail1 = createMatchDetailJson("BR1_101", "lucas-puuid-123", true, 8, 2, 10, "Ahri");
        String matchDetail2 = createMatchDetailJson("BR1_102", "lucas-puuid-123", false, 3, 5, 4, "LeeSin");

        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_101"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(matchDetail1)));

        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_102"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(matchDetail2)));

        // First execution (Cache Miss)
        mockMvc.perform(MockMvcRequestBuilders.get("/api/summoner/Lucas/BR1")
                        .param("region", "BR1")
                        .param("count", "2")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.puuid", is("lucas-puuid-123")))
                .andExpect(jsonPath("$.gameName", is("Lucas")))
                .andExpect(jsonPath("$.tagLine", is("BR1")))
                .andExpect(jsonPath("$.rankedQueues.soloDuo.tier", is("GOLD")))
                .andExpect(jsonPath("$.rankedQueues.soloDuo.rank", is("II")))
                .andExpect(jsonPath("$.rankedQueues.soloDuo.leaguePoints", is(37)))
                .andExpect(jsonPath("$.rankedQueues.soloDuo.winRate", closeTo(54 * 100.0 / 102, 0.001)))
                .andExpect(jsonPath("$.rankedQueues.flex.tier").doesNotExist())
                .andExpect(jsonPath("$.matches", hasSize(2)))
                .andExpect(jsonPath("$.matches[0].matchId", is("BR1_102"))) // Sorted alphabetically reverse order
                .andExpect(jsonPath("$.matches[0].championName", is("LeeSin")))
                .andExpect(jsonPath("$.matches[1].matchId", is("BR1_101")))
                .andExpect(jsonPath("$.matches[1].championName", is("Ahri")));

        // Verify that WireMock received requests
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/br1.api.riotgames.com/lol/league/v4/entries/by-puuid/lucas-puuid-123")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/by-puuid/lucas-puuid-123/ids?start=0&count=2")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_101")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_102")));

        // Second execution (Cache Hit)
        mockMvc.perform(MockMvcRequestBuilders.get("/api/summoner/Lucas/BR1")
                        .param("region", "BR1")
                        .param("count", "2")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.puuid", is("lucas-puuid-123")))
                .andExpect(jsonPath("$.matches", hasSize(2)));

        // Verify that profile resolution and match details are served from cache (call count remains 1)
        // whereas match IDs lists are fetched again (call count becomes 2)
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1")));
        wireMockServer.verify(2, getRequestedFor(urlEqualTo("/br1.api.riotgames.com/lol/league/v4/entries/by-puuid/lucas-puuid-123")));
        wireMockServer.verify(2, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/by-puuid/lucas-puuid-123/ids?start=0&count=2")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_101")));
        wireMockServer.verify(1, getRequestedFor(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_102")));
    }

    @Test
    void shouldMapRiotApi404ToHttpClient404() throws Exception {
        // Stub profile lookup to return 404
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Unknown/BR1"))
                .willReturn(aResponse()
                        .withStatus(404)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"status\":{\"message\":\"Data not found - summoner not found\",\"status_code\":404}}")));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/summoner/Unknown/BR1")
                        .param("region", "BR1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void shouldMapRiotApi429ToHttpClient429() throws Exception {
        // Stub profile lookup to return 429
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Limited/BR1"))
                .willReturn(aResponse()
                        .withStatus(429)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"status\":{\"message\":\"Rate limit exceeded\",\"status_code\":429}}")));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/summoner/Limited/BR1")
                        .param("region", "BR1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.error", is("Too Many Requests")))
                .andExpect(jsonPath("$.message", containsString("Rate limit exceeded")));
    }

    @Test
    void shouldReturnPartialMatchesWhenOneMatchFetchFails() throws Exception {
        // Stub profile lookup
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lucas/BR1"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"puuid\":\"lucas-puuid-123\",\"gameName\":\"Lucas\",\"tagLine\":\"BR1\"}")));

        // Stub match IDs fetch
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/by-puuid/lucas-puuid-123/ids?start=0&count=2"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("[\"BR1_102\", \"BR1_101\"]")));

        stubRankedEntries();

        // Stub match details: one succeeds, one fails (500)
        String matchDetail1 = createMatchDetailJson("BR1_101", "lucas-puuid-123", true, 8, 2, 10, "Ahri");
        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_101"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(matchDetail1)));

        wireMockServer.stubFor(get(urlEqualTo("/americas.api.riotgames.com/lol/match/v5/matches/BR1_102"))
                .willReturn(aResponse()
                        .withStatus(500)
                        .withHeader("Content-Type", "application/json")
                        .withBody("Internal Server Error")));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/summoner/Lucas/BR1")
                        .param("region", "BR1")
                        .param("count", "2")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.puuid", is("lucas-puuid-123")))
                .andExpect(jsonPath("$.rankedQueues.soloDuo.tier", is("GOLD")))
                .andExpect(jsonPath("$.matches", hasSize(1))) // Only the successful match is returned
                .andExpect(jsonPath("$.matches[0].matchId", is("BR1_101")))
                .andExpect(jsonPath("$.matches[0].championName", is("Ahri")));
    }

    private void stubRankedEntries() {
        wireMockServer.stubFor(get(urlEqualTo("/br1.api.riotgames.com/lol/league/v4/entries/by-puuid/lucas-puuid-123"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                [
                                  {
                                    "queueType": "RANKED_SOLO_5x5",
                                    "tier": "GOLD",
                                    "rank": "II",
                                    "leaguePoints": 37,
                                    "wins": 54,
                                    "losses": 48
                                  }
                                ]
                                """)));
    }

    private String createMatchDetailJson(
            String matchId,
            String puuid,
            boolean win,
            int kills,
            int deaths,
            int assists,
            String championName
    ) {
        return """
        {
          "metadata": {
            "matchId": "%s",
            "participants": ["%s"]
          },
          "info": {
            "gameCreation": 1620000000000,
            "gameDuration": 1800,
            "queueId": 420,
            "participants": [
              {
                "puuid": "%s",
                "championId": 103,
                "championName": "%s",
                "win": %b,
                "kills": %d,
                "deaths": %d,
                "assists": %d,
                "totalMinionsKilled": 180,
                "neutralMinionsKilled": 4
              }
            ]
          }
        }
        """.formatted(matchId, puuid, puuid, championName, win, kills, deaths, assists);
    }
}
