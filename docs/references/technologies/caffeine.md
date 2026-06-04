# Technology Reference: Caffeine

## Status

Status: Captured

Last updated: 2026-06-04

Captured by: Antigravity

## Technology Decision Reference

Related technology definition: [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md)

Decision area: Caching Layer

Decision status: Confirmed by user

## Why This Technology Was Selected

Caffeine is a high-performance, near-optimal in-memory caching library for Java. It is used to cache Summoner PUUID and Match history details for 15 minutes to stay within Riot API rate limits (20 req/1 sec, 100 req/2 min).

## Official Documentation Sources

| Source | URL or Context7 Library ID | Notes |
| --- | --- | --- |
| Context7 | `/ben-manes/caffeine` | High reputation library ID |
| GitHub | `https://github.com/ben-manes/caffeine` | Source Repository |

## Context7 Notes

Caffeine supports `expireAfterWrite` configurations using specs or builder models, and integrates with Spring Boot caching abstraction.

## Relevant Concepts for This Project

- **TTL (Time to Live)**: Match and summoner data expires exactly 15 minutes after write.
- **In-Memory Store**: Data is stored inside JVM heap memory, meaning restarts clear the cache. This is acceptable for rate limit protection.

## Usage Guidelines for This Project

Configure Caffeine in Java using application properties or via a custom `CacheManager` config. 

## Examples or Patterns to Follow

### Properties-based configuration (Spring Boot)
Specify in `application.yml`:
```yaml
spring:
  cache:
    type: caffeine
    cache-names: summoners,matches
    caffeine:
      spec: expireAfterWrite=15m,maximumSize=1000
```

### Manual configuration in Spring Config
```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("summoners", "matches");
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(15, TimeUnit.MINUTES)
            .maximumSize(1000));
        return cacheManager;
    }
}
```

## Risks or Caveats

- **Cold Starts**: If the JVM restarts, all cache is cleared, exposing the app to initial Riot API rate limit risks if traffic spiked instantly.

## Related Harness Documents

| Document | Path | Relationship |
| --- | --- | --- |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Source decision |
