# Technology Reference: Caffeine Cache

## Status

Status: Captured

Last updated: 2026-06-04

Captured by: Antigravity

## Technology Decision Reference

Related technology definition: [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md)

Decision area: Local Caching Solution (Backend)

Decision status: Confirmed by user

## Why This Technology Was Selected

Caffeine is a high-performance, near-optimal in-memory caching library for Java. For Analysis.GG's MVP, it provides an out-of-the-box solution for key requirements:
- Time-based expiration (exactly 15-minute TTL) to protect the Riot API from rate limits.
- Maximum size-based eviction to prevent memory growth under load.
- Avoids the complexity of writing custom clean-up schedulers compared to raw `ConcurrentHashMap`.

## Official Documentation Sources

| Source | URL or Context7 Library ID | Notes |
| --- | --- | --- |
| Context7 | /ben-manes/caffeine | Context7 library ID resolved successfully |
| GitHub Wiki | https://github.com/ben-manes/caffeine/wiki | Official wiki |

## Context7 Notes

Caffeine supports manual caching configurations using a builder interface. Cache eviction is thread-safe and performed automatically.

## Relevant Concepts for This Project

- **expireAfterWrite**: Evicts entries after a fixed duration has elapsed since creation or the most recent replacement of the value. This matches the 15-minute sync rule.
- **maximumSize**: Limits the maximum number of entries to prevent JVM OutOfMemory errors.
- **systemScheduler**: Prompts fast eviction of expired entries.

## Usage Guidelines for This Project

- Define a single instance of Caffeine Cache inside a configuration class or a Spring bean component (e.g., `CacheManager` or custom service bean).
- Set `expireAfterWrite(15, TimeUnit.MINUTES)` or use the specifications builder.
- Configure `maximumSize` to a reasonable limit (e.g., `1000` player profiles).

## Examples or Patterns to Follow

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;

// Build manual cache for summoner/match data
Cache<String, PlayerProfile> profileCache = Caffeine.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(15, TimeUnit.MINUTES)
    .build();

// Ingestion lookup pattern
PlayerProfile profile = profileCache.get(riotId, id -> fetchProfileFromRiot(id));
```

## Risks or Caveats

- **In-Memory Only**: Data is lost when the backend JVM restarts. This is completely acceptable for the MVP since we do not persist data to a database.
- **Rate-limit protection**: While caching protects against repeat searches, the initial lookup will still perform up to 100 HTTP requests to Riot API. If multiple users search distinct Riot IDs concurrently, it can trigger Riot API rate limits (HTTP 429). The backend client must handle this.

## Related Harness Documents

| Document | Path | Relationship |
| --- | --- | --- |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Source decision |
