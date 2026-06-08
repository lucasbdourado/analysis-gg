package com.analysisgg.modules.riotapi.adapter.out.integration;

import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotAccountDto;
import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotMatchDto;
import com.analysisgg.modules.riotapi.adapter.out.integration.mapper.RiotMatchMapper;
import com.analysisgg.modules.riotapi.application.port.RiotApiClientPort;
import com.analysisgg.modules.riotapi.domain.exception.PlayerNotFoundException;
import com.analysisgg.modules.riotapi.domain.exception.RateLimitExceededException;
import com.analysisgg.modules.riotapi.domain.exception.RiotApiException;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;
import com.analysisgg.modules.riotapi.domain.valueobject.Puuid;
import com.analysisgg.modules.riotapi.domain.valueobject.Region;
import com.analysisgg.modules.riotapi.domain.valueobject.RiotId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class RiotApiClientAdapter implements RiotApiClientPort {

    private static final System.Logger LOGGER = System.getLogger(RiotApiClientAdapter.class.getName());

    private final RestClient restClient;

    public RiotApiClientAdapter(
            @Value("${riot.api.key}") String apiKey,
            RestClient.Builder restClientBuilder
    ) {
        this.restClient = restClientBuilder
                .defaultHeader("X-Riot-Token", apiKey)
                .build();
    }

    private <T> T executeWithRetry(java.util.function.Supplier<T> requestSupplier) {
        int maxRetries = 3;
        long delayMs = 1000;
        for (int i = 0; i < maxRetries; i++) {
            try {
                return requestSupplier.get();
            } catch (RateLimitExceededException e) {
                if (i == maxRetries - 1) {
                    throw e;
                }
                try {
                    LOGGER.log(System.Logger.Level.WARNING, "Riot API rate limit hit, retrying in " + delayMs + " ms...");
                    Thread.sleep(delayMs);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RiotApiException("Request interrupted during backoff", ie);
                }
                delayMs *= 2;
            }
        }
        throw new RateLimitExceededException("Rate limit exceeded querying Riot API after retries");
    }

    @Override
    public Puuid resolvePuuid(RiotId riotId, Region region) {
        return executeWithRetry(() -> {
            String host = resolveHost(region);
            RiotAccountDto accountDto = restClient.get()
                    .uri("https://{host}/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}",
                            host, riotId.gameName(), riotId.tagLine())
                    .retrieve()
                    .onStatus(status -> status.value() == 404, (req, resp) -> {
                        throw new PlayerNotFoundException("Player " + riotId + " not found in region " + region.value());
                    })
                    .onStatus(status -> status.value() == 429, (req, resp) -> {
                        throw new RateLimitExceededException("Rate limit exceeded querying Riot API");
                    })
                    .onStatus(status -> status.isError(), (req, resp) -> {
                        throw new RiotApiException("Riot API error when resolving PUUID: " + resp.getStatusCode());
                    })
                    .body(RiotAccountDto.class);

            if (accountDto == null || accountDto.puuid() == null) {
                throw new RiotApiException("Invalid response from Riot API when resolving PUUID");
            }

            return new Puuid(accountDto.puuid());
        });
    }

    @Override
    public List<String> fetchMatchIds(Puuid puuid, Region region, int count) {
        return fetchMatchIds(puuid, region, count, null);
    }

    @Override
    public List<String> fetchMatchIds(Puuid puuid, Region region, int count, Integer queue) {
        return executeWithRetry(() -> {
            String host = resolveHost(region);

            String uriStr = "https://{host}/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}";
            Object[] uriVars;
            if (queue != null) {
                uriStr += "&queue={queue}";
                uriVars = new Object[]{host, puuid.value(), count, queue};
            } else {
                uriVars = new Object[]{host, puuid.value(), count};
            }

            List<String> matchIds = restClient.get()
                    .uri(uriStr, uriVars)
                    .retrieve()
                    .onStatus(status -> status.value() == 429, (req, resp) -> {
                        throw new RateLimitExceededException("Rate limit exceeded querying Riot API");
                    })
                    .onStatus(status -> status.isError(), (req, resp) -> {
                        throw new RiotApiException("Riot API error when fetching match IDs: " + resp.getStatusCode());
                    })
                    .body(new ParameterizedTypeReference<List<String>>() {});

            if (matchIds == null) {
                return List.of();
            }

            return matchIds;
        });
    }

    @Override
    public MatchSummary fetchMatchDetail(String matchId, Puuid targetPuuid, Region region) {
        return executeWithRetry(() -> {
            String host = resolveHost(region);

            RiotMatchDto matchDto = restClient.get()
                    .uri("https://{host}/lol/match/v5/matches/{matchId}", host, matchId)
                    .retrieve()
                    .onStatus(status -> status.value() == 429, (req, resp) -> {
                        throw new RateLimitExceededException("Rate limit exceeded querying Riot API");
                    })
                    .onStatus(status -> status.isError(), (req, resp) -> {
                        throw new RiotApiException("Riot API error when fetching match details: " + resp.getStatusCode());
                    })
                    .body(RiotMatchDto.class);

            if (matchDto == null) {
                throw new RiotApiException("Invalid match details response for match ID: " + matchId);
            }

            return RiotMatchMapper.toDomain(matchDto, targetPuuid.value());
        });
    }

    private String resolveHost(Region region) {
        String val = region.value().toLowerCase().trim();
        return switch (val) {
            case "br1", "na1" -> "americas.api.riotgames.com";
            case "euw1", "eune1" -> "europe.api.riotgames.com";
            case "kr" -> "asia.api.riotgames.com";
            default -> throw new IllegalArgumentException("Unsupported region value: " + region.value());
        };
    }
}
