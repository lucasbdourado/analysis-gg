# Decision and Design Reference: Riot API and Internal REST API Contracts

This document establishes the JSON request and response contract design reference for the Riot API integrations (Account-v1, Match-v5), the internal REST API endpoint, custom error responses, and Jackson object mapper configurations.

---

## 1. Riot Account-v1 API Schema and Mapping

### External Request
- **Endpoint**: `GET https://{regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`
- **Headers**: `X-Riot-Token: <api-key>`
- **Regional Routes Mapping**:
  - `br1`, `na1` -> `americas.api.riotgames.com`
  - `euw1`, `eune1` -> `europe.api.riotgames.com`
  - `kr` -> `asia.api.riotgames.com`

### External JSON Response Schema
```json
{
  "puuid": "H4sIAAAAAAAA_...",
  "gameName": "PlayerName",
  "tagLine": "TAG"
}
```

### Internal Domain Mapping
DTO mapped at the outbound integration adapter:
```java
package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

import com.analysisgg.modules.riotapi.domain.model.RiotAccount;

public record RiotAccountDto(
    String puuid,
    String gameName,
    String tagLine
) {
    public RiotAccount toDomain() {
        return new RiotAccount(puuid, gameName, tagLine);
    }
}
```

Internal domain model/value object under `domain/model/`:
```java
package com.analysisgg.modules.riotapi.domain.model;

public record RiotAccount(
    String puuid,
    String gameName,
    String tagLine
) {}
```

---

## 2. Riot Match-v5 API Schema and Mapping

### External Request
- **Endpoint**: `GET https://{regionalRoute}.api.riotgames.com/lol/match/v5/matches/{matchId}`
- **Headers**: `X-Riot-Token: <api-key>`

### External JSON Response Schema
Abridged structure showing only the fields utilized by the adapter mapping logic:
```json
{
  "metadata": {
    "dataVersion": "2",
    "matchId": "BR1_123456789",
    "participants": [
      "H4sIAAAAAAAA_...",
      "..."
    ]
  },
  "info": {
    "gameCreation": 1785984000000,
    "gameDuration": 1800,
    "queueId": 420,
    "participants": [
      {
        "puuid": "H4sIAAAAAAAA_...",
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
        "puuid": "other_puuid",
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
```

### Internal Domain Mapping
Outbound Integration DTOs:
```java
package com.analysisgg.modules.riotapi.adapter.out.integration.dto;

import java.util.List;

public record RiotMatchDto(
    MetadataDto metadata,
    InfoDto info
) {
    public record MetadataDto(
        String matchId,
        List<String> participants
    ) {}

    public record InfoDto(
        long gameCreation,
        long gameDuration,
        int queueId,
        List<ParticipantDto> participants
    ) {}

    public record ParticipantDto(
        String puuid,
        int championId,
        String championName,
        boolean win,
        int kills,
        int deaths,
        int assists,
        int totalMinionsKilled,
        int neutralMinionsKilled
    ) {}
}
```

#### Extraction and Mapping Logic
When mapping `RiotMatchDto` to the internal domain `MatchSummary`, the adapter filters the `participants` list matching the player's target `puuid` to compile the stats:
```java
package com.analysisgg.modules.riotapi.adapter.out.integration.mapper;

import com.analysisgg.modules.riotapi.adapter.out.integration.dto.RiotMatchDto;
import com.analysisgg.modules.riotapi.domain.model.MatchSummary;

public class RiotMatchMapper {
    public static MatchSummary toDomain(RiotMatchDto dto, String targetPuuid) {
        var matchId = dto.metadata().matchId();
        var info = dto.info();
        
        var targetParticipant = info.participants().stream()
            .filter(p -> p.puuid().equals(targetPuuid))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Target PUUID not found in match participants list"));

        return new MatchSummary(
            matchId,
            info.gameDuration(),
            info.gameCreation(),
            info.queueId(),
            targetParticipant.win(),
            targetParticipant.championId(),
            targetParticipant.championName(),
            targetParticipant.kills(),
            targetParticipant.deaths(),
            targetParticipant.assists(),
            targetParticipant.totalMinionsKilled(),
            targetParticipant.neutralMinionsKilled()
        );
    }
}
```

Internal domain model under `domain/model/`:
```java
package com.analysisgg.modules.riotapi.domain.model;

public record MatchSummary(
    String matchId,
    long gameDuration,
    long gameCreation,
    int queueId,
    boolean win,
    int championId,
    String championName,
    int kills,
    int deaths,
    int assists,
    int totalMinionsKilled,
    int neutralMinionsKilled
) {}
```

---

## 3. Spring Boot REST API Endpoint `/api/summoner/{gameName}/{tagLine}`

### Route Contract
- **Method**: `GET`
- **Path**: `/api/summoner/{gameName}/{tagLine}`
- **Query Parameters**:
  - `region` (String, required): Platform region (e.g. `br1`)
  - `count` (Integer, optional, default: 20): Number of matches to retrieve (range: 1 - 100)

### Internal Response DTOs
```java
package com.analysisgg.modules.riotapi.adapter.in.web.dto;

import java.util.List;

public record PlayerAnalyticsResponse(
    String puuid,
    String gameName,
    String tagLine,
    String region,
    List<MatchSummaryResponse> matches
) {
    public record MatchSummaryResponse(
        String matchId,
        long gameDuration,
        long gameCreation,
        int queueId,
        boolean win,
        int championId,
        String championName,
        int kills,
        int deaths,
        int assists,
        int totalMinionsKilled,
        int neutralMinionsKilled
    ) {}
}
```

### JSON Response Body
```json
{
  "puuid": "H4sIAAAAAAAA_...",
  "gameName": "PlayerName",
  "tagLine": "TAG",
  "region": "br1",
  "matches": [
    {
      "matchId": "BR1_123456789",
      "gameDuration": 1800,
      "gameCreation": 1785984000000,
      "queueId": 420,
      "win": true,
      "championId": 103,
      "championName": "Ahri",
      "kills": 8,
      "deaths": 2,
      "assists": 12,
      "totalMinionsKilled": 180,
      "neutralMinionsKilled": 12
    }
  ]
}
```

---

## 4. Custom API Error Payload Schema

Standardized error response returned when request validations fail or external service calls return errors.

### JSON Error Schema
```json
{
  "timestamp": "2026-06-06T05:40:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Player PlayerName#TAG not found"
}
```

### Internal Error DTO Class
```java
package com.analysisgg.modules.riotapi.adapter.in.web.dto;

import java.time.Instant;

public record ApiErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message
) {}
```

### HTTP Error Status Mappings
- **400 Bad Request**: Input validation failures (e.g. invalid Riot ID format or region).
- **404 Not Found**: Player profile or match data not found in Riot API.
- **429 Too Many Requests**: Riot API developer key rate limits exceeded.
- **500 Internal Server Error**: Generic backend server error or unhandled integration failures.
- **504 Gateway Timeout**: Riot API client HTTP connection timeout.

---

## 5. Input Validation Parameters

| Parameter | Type | Validation Rules | Error Code |
| --- | --- | --- | --- |
| `gameName` | Path Variable | Must match regex: `^[a-zA-Z0-9\s_.-]{3,16}$` | 400 Bad Request |
| `tagLine` | Path Variable | Must match regex: `^[a-zA-Z0-9]{3,5}$` | 400 Bad Request |
| `region` | Query Parameter | Whitelist values: `br1`, `na1`, `euw1`, `eune1`, `kr` | 400 Bad Request |
| `count` | Query Parameter | Range: `[1, 100]`. Coerces to default of `20` if null or out of bounds. | None (coerced) |

---

## 6. Global ObjectMapper Configuration Decision

To shield the application from deserialization exceptions caused by undocumented payload additions or updates in Riot Games API responses, the application-wide Jackson `ObjectMapper` is configured to ignore unknown properties.

### Jackson Configuration Setting
- **Feature**: `DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES` -> `false`

### Spring Boot Property Configuration
Add to `application.properties` or `application.yml`:
```properties
spring.jackson.deserialization.fail-on-unknown-properties=false
```

### Java Configuration Implementation
```java
package com.analysisgg.infrastructure.integration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper;
    }
}
```
