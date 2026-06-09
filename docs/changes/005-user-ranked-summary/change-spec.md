# Change Spec: User Ranked Summary

## 1. Overview

This specification defines a compact account summary for the dashboard header. The summary must show the selected account region with a small flag and the player's current ranked status for Solo/Duo and Flex: tier, division, LP, official wins, official losses, and official ranked win rate.

The backend must extend the existing Riot integration beyond Account-v1 and Match-v5 by fetching League-v4 ranked entries by PUUID on platform routing hosts such as `br1.api.riotgames.com`. The internal analytics response must add `rankedQueues.soloDuo` and `rankedQueues.flex` without changing the existing match-driven widgets. The frontend must update its response type and render a compact profile/ranked summary near the existing dashboard filters.

## 2. Research Checklist

- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior, if applicable.
- [x] Analyze directly related code areas.
- [x] Analyze existing tests directly related to the change.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.
- [x] Analyze API contract impact.
- [x] Analyze backward compatibility.
- [x] Use browser automation to observe UI behavior when available.

## 3. Source Context

- User-provided plan: Confirms the goal, response contract, flag mapping, missing queue behavior, test plan, and out-of-scope historical rank behavior.
- [PlayerAnalytics.java](../../../src/main/java/com/analysisgg/modules/riotapi/domain/model/PlayerAnalytics.java): Current domain analytics model exposes `puuid`, player identity, `region`, and `matches` only.
- [PlayerAnalyticsResponse.java](../../../src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/PlayerAnalyticsResponse.java): Current backend response DTO mirrors the domain fields and has no ranked queue data.
- [RiotApiWebMapper.java](../../../src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiWebMapper.java): Maps `PlayerAnalytics` to `PlayerAnalyticsResponse`; this is the response extension point.
- [SyncPlayerProfileUseCase.java](../../../src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java): Orchestrates PUUID resolution, match ID retrieval, match detail caching, and analytics construction.
- [RiotApiClientPort.java](../../../src/main/java/com/analysisgg/modules/riotapi/application/port/RiotApiClientPort.java): Current outbound Riot API port exposes PUUID resolution, match ID fetch, and match detail fetch only.
- [RiotApiClientAdapter.java](../../../src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java): Current adapter uses regional routing hosts for Account-v1 and Match-v5, with no League-v4 method.
- [Region.java](../../../src/main/java/com/analysisgg/modules/riotapi/domain/valueobject/Region.java): Supported regions are `br1`, `na1`, `euw1`, `eune1`, and `kr`.
- [RiotApiController.java](../../../src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java): Exposes `GET /api/summoner/{gameName}/{tagLine}` and delegates to the sync use case.
- [RiotApiExceptionHandler.java](../../../src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiExceptionHandler.java): Maps validation, not found, rate limit, timeout, Riot API, and generic failures to current HTTP responses.
- [RiotApiControllerTest.java](../../../src/test/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiControllerTest.java): Locks in successful response behavior and existing `400`, `404`, `429`, `500`, and `504` error handling expectations.
- [RiotApiClientAdapterTest.java](../../../src/test/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapterTest.java): Tests current Account-v1 and Match-v5 adapter behavior and routing.
- [SyncPlayerProfileUseCaseTest.java](../../../src/test/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCaseTest.java): Tests use case cache hit/miss, match fetching, partial failure, parallel fetch, and queue-filtered match fetch behavior.
- [PlayerAnalyticsResponse.ts](../../../src/main/frontend/src/features/dashboard/infrastructure/api/PlayerAnalyticsResponse.ts): Frontend response type currently has no ranked queue shape.
- [dashboardApi.ts](../../../src/main/frontend/src/features/dashboard/infrastructure/api/dashboardApi.ts): Frontend API client fetches `/api/summoner/...` and returns `PlayerAnalyticsResponse`.
- [usePlayerAnalytics.ts](../../../src/main/frontend/src/features/dashboard/presentation/hooks/usePlayerAnalytics.ts): Fetches analytics and merges match results for active queue filters; merged responses currently preserve only the first response metadata plus merged `matches`.
- [DashboardPage.tsx](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx): Dashboard header currently renders `gameName`, `tagLine`, textual `region`, and filter controls.
- [DashboardPage.module.css](../../../src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.module.css): Header and filter layout styles likely need responsive updates for the summary.
- [regions.ts](../../../src/main/frontend/src/shared/lib/validation/regions.ts): Frontend supported region options match backend region support.
- Riot Developer Portal League of Legends docs, `https://developer.riotgames.com/docs/lol`: Confirms Riot ID to PUUID guidance, PUUID-first recommendations where available, and platform versus regional routing values.
- Riot Developer Portal API reference, `https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesByPUUID`: Official API reference entry for League-v4 ranked entries by PUUID. Browser-rendered API detail content was not fully available through static fetch, but the endpoint is the expected Riot League-v4 PUUID route for current ranked entries.

## 4. Confirmed Facts

- The current dashboard displays player identity and textual region only; it does not display ranked queue status.
- Current backend `PlayerAnalytics` and `PlayerAnalyticsResponse` expose only `puuid`, `gameName`, `tagLine`, `region`, and `matches`.
- Current Riot client port and adapter have no League-v4 integration.
- Current adapter uses a single `resolveHost(Region)` method that maps `br1` and `na1` to `americas.api.riotgames.com`, `euw1` and `eune1` to `europe.api.riotgames.com`, and `kr` to `asia.api.riotgames.com`.
- Riot routing docs distinguish platform routing values such as `BR1 -> br1.api.riotgames.com`, `KR -> kr.api.riotgames.com`, `NA1 -> na1.api.riotgames.com`, `EUW1 -> euw1.api.riotgames.com`, and regional routing values such as `AMERICAS`, `ASIA`, and `EUROPE`.
- The requested League-v4 ranked summary must be fetched by PUUID, not by summoner name.
- The requested queues are Solo/Duo and Flex only.
- Missing queue entries must render as `Unranked`, with no LP and no win rate.
- The official ranked win rate must be computed from Riot League-v4 `wins` and `losses`, not from recently loaded dashboard matches or active filters.
- Existing chart/table widgets should keep calculating from loaded matches and filters.
- The confirmed flag mapping is `BR1 -> Brazil`, `KR -> Korea`, `NA1 -> United States`, and `EUW1`/`EUNE1 -> European Union`.
- Browser UI observation was attempted, but the in-app Playwright browser profile was locked by an existing browser instance. Current UI behavior was therefore verified from source code only.

## 5. Inferences and Assumptions

- League-v4 ranked entries should be fetched after resolving or reading the cached PUUID and before constructing `PlayerAnalytics`.
- Ranked entries are small and player-current; caching can reasonably follow the existing profile cache TTL unless implementation discovers a more specific cache boundary already available.
- `rankedQueues.soloDuo` should map Riot `queueType = RANKED_SOLO_5x5`.
- `rankedQueues.flex` should map Riot `queueType = RANKED_FLEX_SR`.
- `winRate` should be a nullable numeric percentage computed as `wins / (wins + losses) * 100`; return `null` when the queue is unranked or total games are zero.
- `tier`, `rank`, `leaguePoints`, `wins`, and `losses` should be nullable for unranked queues so clients can distinguish unavailable ranked data from zero values.
- The frontend flag can be implemented with a small static mapping in code, using the existing platform region string from the analytics response.

## 6. Questions and Answers

- No additional questions were asked in this implementation pass because the provided plan includes the relevant product decisions and confirmed defaults.
- User-provided confirmed default: "Elo atual e anterior" is treated as current ranked status by queue only; no historical or previous-season rank is included.
- User-provided confirmed default: Win rate is official ranked win rate per queue from Riot ranked data, not calculated from recent dashboard matches.
- User-provided confirmed default: If League-v4 returns no entry for a queue, the UI shows `Unranked`.
- User-provided confirmed default: Use the simple platform-to-flag mapping listed in this spec.

## 7. Current Behavior

- The dashboard route reads `name`, `tag`, and `region` from URL query parameters.
- `usePlayerAnalytics` fetches the analytics response from `/api/summoner/{gameName}/{tagLine}?region={region}&count={count}` and may issue additional queue-filtered requests for active filters.
- On success, `DashboardPage` renders a header containing the player name, tagline, and a textual region badge.
- The filters are rendered in the same header area through `MatchQueueFilter` and `MatchRangeFilter`.
- The page passes `data.matches` into `DashboardProvider`; all widgets calculate from the match list and filter state.
- Backend success responses currently include no ranked entries or official ranked win rate.

## 8. Expected Behavior

- Backend analytics responses include a new `rankedQueues` object:
  - `rankedQueues.soloDuo`
  - `rankedQueues.flex`
- Each ranked queue entry includes:
  - `queueType`
  - `tier`
  - `rank`
  - `leaguePoints`
  - `wins`
  - `losses`
  - `winRate`
- The backend fetches ranked queue entries from Riot League-v4 by PUUID using the selected platform routing host.
- If Riot returns no entry for Solo/Duo or Flex, the corresponding summary is present as an unranked/null-safe queue summary.
- The dashboard header renders a compact account/ranked summary above or alongside existing filters.
- The region summary includes a small flag derived from the selected platform mapping.
- The official ranked win rate remains stable when the user changes match range or match queue filters.
- Existing loading and error states continue to work when Riot API calls fail.
- Existing match widgets remain unchanged in purpose and continue to calculate from loaded and filtered matches.

## 9. Scope

- Add domain and response models for ranked queue summaries.
- Extend `RiotApiClientPort` and `RiotApiClientAdapter` with a League-v4 method for ranked entries by PUUID.
- Add a platform host resolver separate from the existing regional host resolver.
- Fetch ranked entries in `SyncPlayerProfileUseCase` and include them in `PlayerAnalytics`.
- Update `RiotApiWebMapper` and backend response DTOs to expose `rankedQueues`.
- Update backend tests for League-v4 mapping, unranked behavior, win rate computation, controller response payload, and existing error handling.
- Update frontend `PlayerAnalyticsResponse` type to include `rankedQueues`.
- Add a compact ranked summary component or equivalent dashboard header section.
- Add frontend tests for ranked display, unranked display, region flag mapping, and filter/range independence from official ranked win rate.

## 10. Out of Scope

- Historical rank, previous-season rank, or rank progression.
- MMR, estimated Elo, or non-official rating calculations.
- Changing how existing chart/table widgets calculate from match history.
- Adding persistent storage.
- Adding new supported Riot platform regions beyond `BR1`, `NA1`, `EUW1`, `EUNE1`, and `KR`.
- Replacing the current dashboard filter model.
- Direct frontend calls to Riot APIs.

## 11. Functional Acceptance Criteria

- **AC1: Ranked Payload Present**: `GET /api/summoner/{gameName}/{tagLine}?region={region}` returns `rankedQueues.soloDuo` and `rankedQueues.flex` in addition to existing fields.
- **AC2: Solo/Duo Mapping**: A Riot entry with `queueType = RANKED_SOLO_5x5` renders as the Solo/Duo ranked summary with tier, division, LP, wins, losses, and computed win rate.
- **AC3: Flex Mapping**: A Riot entry with `queueType = RANKED_FLEX_SR` renders as the Flex ranked summary with tier, division, LP, wins, losses, and computed win rate.
- **AC4: Unranked Mapping**: If a queue is absent from League-v4 results, that queue renders as `Unranked` with no LP and no win rate.
- **AC5: Region Flag**: The summary renders the configured flag for `BR1`, `KR`, `NA1`, `EUW1`, and `EUNE1` using the confirmed mapping.
- **AC6: Official Win Rate Isolation**: Changing match range or match queue filters updates existing match widgets but does not recalculate the official ranked win rate from loaded matches.
- **AC7: Existing Widgets Preserved**: Weekday win rate, daily performance grid, top champions table, range filter, and queue filter remain usable and retain their existing match-based behavior.
- **AC8: Error Behavior Preserved**: Existing `400`, `404`, `429`, `500`, and `504` API error handling remains unchanged from the user's perspective.

## 12. Technical Findings

- `PlayerAnalytics` is the domain aggregation point and currently needs a new ranked queue property.
- `PlayerAnalyticsResponse` is a Java record, so adding the response field requires updating constructor calls and tests.
- `RiotApiWebMapper.toResponse` currently maps only match summaries; ranked summaries should be mapped there or pre-shaped in the domain with a clear boundary.
- `RiotApiClientAdapter.resolveHost` is currently regional-routing-specific despite its generic name. League-v4 needs a separate platform host resolver to avoid accidentally calling platform APIs through regional hosts.
- The frontend filter merge path in `usePlayerAnalytics` uses `firstResponse` and spreads it into the final response. If filtered requests return ranked queues, this preserves ranked data from the first response; tests should ensure this does not drop or recompute ranked data when multiple filter requests resolve.
- `DashboardPage` is the most direct place to place a summary component because it already has `data.gameName`, `data.tagLine`, `data.region`, and will have `data.rankedQueues`.
- No existing frontend dashboard test directly covers `DashboardPage` success header rendering; adding a component-level test for the new summary will reduce the need for broader E2E setup.

## 13. Development Guidance

- Keep the existing REST endpoint path and query parameters unchanged.
- Add `rankedQueues` as an additive response field to preserve current consumers.
- Model ranked queue summaries explicitly instead of overloading `MatchSummary`.
- Keep Riot API key handling on the backend only; do not expose League-v4 calls to the frontend.
- Use platform routing for League-v4:
  - `br1 -> br1.api.riotgames.com`
  - `kr -> kr.api.riotgames.com`
  - `na1 -> na1.api.riotgames.com`
  - `euw1 -> euw1.api.riotgames.com`
  - `eune1 -> eun1.api.riotgames.com`
- Continue using regional routing for Account-v1 and Match-v5 unless a separate correction is intentionally made.
- Compute `winRate` from official ranked totals only:
  - `total = wins + losses`
  - `winRate = total > 0 ? wins * 100.0 / total : null`
- Preserve unranked queue objects rather than omitting queue keys; this keeps the frontend rendering path null-safe.
- Frontend rendering should format ranked data compactly, for example `Gold II`, `37 LP`, `54W / 48L`, `52.9%`.
- For unranked queues, render `Unranked` and suppress LP and win rate text.

## 14. Suggested Code Structure and Contracts

### Backend Domain Shape

```java
public record PlayerAnalytics(
    String puuid,
    String gameName,
    String tagLine,
    String region,
    RankedQueues rankedQueues,
    List<MatchSummary> matches
) {}
```

```java
public record RankedQueues(
    RankedQueueSummary soloDuo,
    RankedQueueSummary flex
) {}
```

```java
public record RankedQueueSummary(
    String queueType,
    String tier,
    String rank,
    Integer leaguePoints,
    Integer wins,
    Integer losses,
    Double winRate
) {}
```

### Backend Response Shape

```json
{
  "puuid": "string",
  "gameName": "string",
  "tagLine": "string",
  "region": "br1",
  "rankedQueues": {
    "soloDuo": {
      "queueType": "RANKED_SOLO_5x5",
      "tier": "GOLD",
      "rank": "II",
      "leaguePoints": 37,
      "wins": 54,
      "losses": 48,
      "winRate": 52.94
    },
    "flex": {
      "queueType": "RANKED_FLEX_SR",
      "tier": null,
      "rank": null,
      "leaguePoints": null,
      "wins": null,
      "losses": null,
      "winRate": null
    }
  },
  "matches": []
}
```

### Riot League-v4 Adapter Contract

```java
List<RankedQueueSummary> fetchRankedEntries(Puuid puuid, Region region);
```

Expected external request:

```text
GET https://{platformHost}/lol/league/v4/entries/by-puuid/{encryptedPUUID}
```

Expected Riot fields used:

- `queueType`
- `tier`
- `rank`
- `leaguePoints`
- `wins`
- `losses`

### Frontend Type Shape

```typescript
export interface RankedQueueSummary {
  queueType: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winRate: number | null;
}

export interface RankedQueues {
  soloDuo: RankedQueueSummary;
  flex: RankedQueueSummary;
}
```

### Frontend Flag Mapping

```typescript
const REGION_FLAGS: Record<string, string> = {
  BR1: 'Brazil',
  KR: 'Korea',
  NA1: 'United States',
  EUW1: 'European Union',
  EUNE1: 'European Union',
};
```

Implementation may map those labels to emoji, CSS background images, or local assets, as long as the visible result is a small flag and remains accessible.

## 15. Validation References

### Unit tests

- `RiotApiClientAdapterTest.java`: Verify League-v4 calls use platform hosts and deserialize ranked entries.
- `SyncPlayerProfileUseCaseTest.java`: Verify ranked entries are included in `PlayerAnalytics` on profile cache hit and cache miss paths.
- New ranked mapper/model tests: Verify Solo/Duo and Flex queue mapping, missing queue unranked mapping, and zero-game win rate safety.
- `RiotApiWebMapper` test or existing controller test extension: Verify `rankedQueues` maps into the response DTO.

### Integration tests

- `RiotApiControllerTest.java`: Verify `/api/summoner/{gameName}/{tagLine}` includes `rankedQueues` on success.
- Existing error tests for `400`, `404`, `429`, `500`, and `504` should remain unchanged and passing.
- Verify League-v4 `429` and generic error behavior maps through existing exception handling consistently.

### UI/E2E tests

- Render the dashboard summary with ranked Solo/Duo and Flex entries.
- Render one ranked queue plus one `Unranked` queue.
- Verify the region flag mapping for all supported platform regions.
- Verify changing `MatchRangeFilter` and `MatchQueueFilter` does not alter displayed official ranked win rate unless a new analytics response is fetched.

### Manual validation

- Open the dashboard with a sample account and verify the header layout on desktop.
- Resize to mobile width and verify the summary and filters do not overlap.
- Confirm loading and error states still render when Riot API is unavailable or the key is invalid.
- Confirm existing chart/table widgets still update from match filters.

### Regression checks

- Run backend tests with Maven.
- Run frontend unit tests with Vitest.
- Run frontend build or typecheck to catch response type gaps.

## 16. Regression Risks

- Using regional hosts for League-v4 would fail ranked summary requests even if existing Match-v5 calls keep working.
- Changing the `PlayerAnalytics` record constructor can break existing tests and any code constructing analytics without ranked data.
- A League-v4 failure added to the existing sync path could make the entire dashboard fail where match analytics previously worked; decide whether ranked fetch failures should fail the whole request or degrade to unranked/error-free output before implementation if this becomes contentious.
- Queue-filtered frontend requests may fetch the same ranked summary multiple times. This is acceptable for correctness but can increase Riot API calls unless cached or deduplicated by the backend.
- Frontend merge logic using the first response metadata can preserve stale ranked data if parallel filtered responses return inconsistent ranked summaries. This risk is low if backend ranked entries are current and cached consistently.
- Header layout changes can crowd existing filters on mobile.
- Treating unranked `wins` and `losses` as zero instead of null could incorrectly render `0W / 0L` and imply official data exists.

## 17. Open Blockers and Pending Decisions

- Open blockers:
  - None
- Pending decisions:
  - None from the provided user plan.
- Research limitations:
  - Browser UI observation through Playwright was blocked by a locked in-app browser profile.
- Implementation note:
  - If developers want ranked fetch failures to degrade gracefully instead of failing the whole analytics request, confirm that policy before coding. The current user plan requires existing error handling to remain unchanged but does not explicitly choose partial ranked degradation.

## 18. Readiness Checklist

- [ ] The requested change is clear.
- [ ] The expected behavior is documented.
- [ ] The current behavior is documented or explicitly marked as unknown.
- [ ] Relevant sources were reviewed.
- [ ] Relevant code areas were reviewed.
- [ ] Relevant tests were reviewed or absence was documented.
- [ ] Relevant UI behavior was observed with Playwright MCP when applicable.
- [ ] Relevant questions were asked one at a time.
- [ ] User answers were documented.
- [ ] Open blockers are documented.
- [ ] Pending decisions are documented.
- [ ] Development guidance is documented.
- [ ] Expected code structure or contracts are documented.
- [ ] Suggested validation scenarios are documented.

## 19. Structured Agent Reference

```json
{
  "spec": {
    "index": "005",
    "name": "user-ranked-summary",
    "path": "docs/changes/005-user-ranked-summary/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Add a compact dashboard account summary with selected region flag and current official Solo/Duo and Flex ranked status from Riot League-v4 by PUUID.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "User Ranked Summary Dashboard Spec",
        "purpose": "Defines requested behavior, data contract, flag mapping, test plan, and confirmed defaults"
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/domain/model/PlayerAnalytics.java",
        "purpose": "Identifies current backend analytics domain contract"
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java",
        "purpose": "Identifies current Account-v1 and Match-v5 Riot integration and routing behavior"
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/pages/DashboardPage.tsx",
        "purpose": "Identifies current dashboard header layout and summary insertion point"
      },
      {
        "type": "documentation",
        "reference": "https://developer.riotgames.com/docs/lol",
        "purpose": "Confirms Riot ID to PUUID guidance and platform versus regional routing values"
      },
      {
        "type": "documentation",
        "reference": "https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesByPUUID",
        "purpose": "References official League-v4 ranked entries by PUUID endpoint"
      },
      {
        "type": "tool",
        "reference": "Playwright MCP browser_navigate",
        "purpose": "Attempted UI observation; blocked by locked browser profile"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [
      {
        "tool": "Playwright MCP or browser automation",
        "requiredWhen": "Dashboard UI layout is changed",
        "purpose": "Verify desktop and mobile header layout, loading state, error state, and no text overlap"
      }
    ],
    "importantConstraints": [
      {
        "constraint": "Use Riot League-v4 by PUUID on platform routing hosts for ranked entries",
        "reason": "The requested ranked data is current official queue status and League-v4 uses platform routing"
      },
      {
        "constraint": "Existing widgets remain match-filter-driven",
        "reason": "Official ranked win rate must not replace current match-history analytics calculations"
      },
      {
        "constraint": "Missing queue entries render as Unranked with no LP and no win rate",
        "reason": "Avoid implying official ranked data exists when Riot returns no queue entry"
      },
      {
        "constraint": "Riot API key remains backend-only",
        "reason": "The existing architecture protects Riot credentials from the frontend"
      }
    ],
    "userConfirmedDecisions": [
      "Current ranked status only; no historical or previous-season rank",
      "Official win rate comes from Riot ranked wins/losses, not recent dashboard matches",
      "Missing League-v4 queue entry renders as Unranked",
      "Flag mapping: BR1 Brazil, KR Korea, NA1 United States, EUW1/EUNE1 European Union"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "League-v4 platform routing",
      "Solo/Duo and Flex queue mapping",
      "Unranked and zero-game win rate behavior",
      "Backward-compatible analytics response extension",
      "Dashboard header layout on desktop and mobile",
      "Official ranked win rate independence from match filters"
    ]
  }
}
```
