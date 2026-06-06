# Task Decision: Cache Key Design and Configuration for Caffeine Caches

## Status

Status: Confirmed

Last updated: 2026-06-06

Decision file: `docs/features/riot-api-integration/decisions/005-cache-keys-and-configuration.md`

## Task Reference

Task ID: `005-implement-caffeine-cache-adapter`

Task file: `docs/features/riot-api-integration/tasks/005-implement-caffeine-cache-adapter.md`

Task plan file: `docs/features/riot-api-integration/task-plans/005-implement-caffeine-cache-adapter-plan.md`

Feature: `riot-api-integration`

## Context

To implement the Caffeine cache configuration and adapter (`CaffeineCacheAdapter`), we need to define the cache keys used to identify player profiles (RiotAccount) and match summaries (MatchSummary) in the in-memory Caffeine caches.

## Decision Needed

What design approach should we take for cache keys in Caffeine?
1. Use type-safe composite Java records.
2. Use concatenated String keys.

## Options Considered

| Option | Summary | Trade-offs |
| --- | --- | --- |
| **Option 1: Type-Safe Records** (Selected) | Define `ProfileCacheKey` and `MatchSummaryCacheKey` as Java records. | **Pros**: Strict type-safety, automatically generated clean `equals()` and `hashCode()` contracts, no string splitting/concatenation errors. <br>**Cons**: Extra classes to define (though they are very small records). |
| **Option 2: Concatenated Strings** | Build a string key such as `region:name#tagline` and `puuid:matchId`. | **Pros**: Fewer classes to write. <br>**Cons**: Vulnerable to encoding/concatenation bugs, error-prone when parsing, lacks compile-time safety. |

## User Decision

The user confirmed and selected **Option 1**: Use type-safe Java records for cache keys (e.g. `ProfileCacheKey` and `MatchSummaryCacheKey`) to enforce type-safety and clean `equals()` and `hashCode()` contracts.

## Rationale

Java records are the modern, standard way to build immutable value-like keys in Java applications. By encapsulating composite keys in records, we avoid error-prone string parsing, guarantee proper hash distribution, and prevent accidental collisions between different cache key types.

## Impact

- **Implementation**: The key records will be implemented as package-private or public classes inside the outbound adapter layer (`com.analysisgg.modules.riotapi.adapter.out.cache`).
- **Clean Architecture isolation**: The application port interface `PlayerProfileCachePort` remains pure by accepting standard domain objects (`RiotId`, `Region`, `Puuid`) instead of adapter-specific key classes. The mapping/wrapping into keys will happen inside the `CaffeineCacheAdapter` class.
- **Beans definition**: The configured Caffeine caches will use the record classes as keys: `Cache<ProfileCacheKey, RiotAccount>` and `Cache<MatchSummaryCacheKey, MatchSummary>`.

## Date

Decision date: 2026-06-06

## Notes

None.
