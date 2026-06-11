# Change Spec: Summoner Icon and Historical Ranks

## 1. Overview

This change enhances the player profile header on the dashboard by adding the Summoner Profile Icon (photo) with a level badge overlay positioned above their nickname. It also introduces a list of past season ranks (e.g., S2024, S2023, S2022) displayed as compact pills. Because the official Riot Games API does not expose historical rank data, these past ranks will be consistently simulated in the backend using the player's unique PUUID as a generator seed.

## 2. Research Checklist

- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior.
- [x] Analyze directly related code areas.
- [x] Analyze existing tests directly related to the change.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context

- **Riot Summoner v4 API:** `GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}` (returns `profileIconId` and `summonerLevel`).
- **Profile Summary Component:** [AccountRankedSummary.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx)
- **Profile Summary Styles:** [AccountRankedSummary.module.css](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.module.css)
- **Backend Use Case:** [SyncPlayerProfileUseCase.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java)
- **Riot API Client Port & Adapter:** [RiotApiClientPort.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/port/RiotApiClientPort.java) and [RiotApiClientAdapter.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java)

## 4. Confirmed Facts

- The backend caches player profile requests for 15 minutes using Caffeine Cache.
- The Riot Games API only provides current ranked league entries; it does not offer historical season elo listings.
- Calling `/lol/summoner/v4/summoners/by-puuid/{puuid}` requires using the platform-specific hosts (e.g. `br1.api.riotgames.com`).
- Profile images can be loaded from CommunityDragon's versionless CDN: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/{id}.jpg` or Riot's Data Dragon CDN.

## 5. Inferences and Assumptions

- We assume generating stable pseudo-random ranks based on `puuid.hashCode()` as a seed will provide an elegant user experience mimicking a tracking database without requiring database tables or migrations.
- The fallback profile icon ID 29 will be used if the profile icon fails to load or is not present.

## 6. Questions and Answers

- **Question:** How should past seasons' ranks be sourced given the lack of Riot API historical support?
  - **Why it matters:** Determines frontend/backend scope and infrastructure requirements.
  - **User Answer:** Option 1 - Simulate ranks consistently in the backend using a seed from the player's PUUID.
  - **Effect on the spec:** We will implement a stable seed-based generator in the Java backend use case to produce consistent past ranks.

## 7. Current Behavior

- The profile summary only displays the region flag, Riot ID (Name + Tagline), and region name.
- No player profile icon (photo), level, or past season ranks are shown.

## 8. Expected Behavior

- **Profile Icon & Level:** A square image (5.5rem) displaying the player's Summoner Icon is positioned above the nickname. A level badge overlay is centered at the bottom edge of the image showing their summoner level (e.g., "158").
- **Past Seasons' Ranks:** A row of compact pills (e.g. `S2024 GOLD II`, `S2023 SILVER I`) is shown at the very top of the card.
- **Responsive Layout:** The vertical structure (icon above nickname) is maintained on desktop and mobile. On tablet layouts, the elements flow cleanly side-by-side using flex rows.

## 9. Scope

- **Backend Integration:**
  - Create `RiotSummonerDto` DTO class.
  - Extend `RiotApiClientPort` and `RiotApiClientAdapter` to fetch summoner details by PUUID.
  - Add `profileIconId` and `summonerLevel` to `RiotAccount` and `PlayerAnalytics` domain models.
  - Implement a PUUID-seeded historical rank generator in the use-case layer.
  - Map new fields in `RiotApiWebMapper` to `PlayerAnalyticsResponse`.
- **Frontend Presentation:**
  - Update TypeScript types in `PlayerAnalyticsResponse.ts`.
  - Update `AccountRankedSummary.tsx` to render the past season badges, profile icon, and level badge overlay.
  - Update `AccountRankedSummary.module.css` with layout rules and style tokens.
- **Validation:**
  - Update backend unit tests in `SyncPlayerProfileUseCaseTest.java` to support the new Summoner API call.
  - Update frontend component tests in `AccountRankedSummary.test.tsx` to assert rendering of icon, level, and past seasons.

## 10. Out of Scope

- Storing actual player rank snapshots over time.
- Customizing icon border designs or customization elements.
- Level progression bars.

## 11. Functional Acceptance Criteria

- **AC 1 (Summoner Icon):** The profile icon image matches the fetched `profileIconId`.
- **AC 2 (Level Overlay):** The correct summoner level is displayed centered at the bottom of the profile icon.
- **AC 3 (Past Season Badges):** A list of past seasons (S2024, S2023, S2022) displays ranks generated consistently (the same player always returns the same ranks).
- **AC 4 (Visual Fallback):** If the profile icon fails to load, it falls back to a default profile icon (ID 29).
- **AC 5 (Responsive Layout):** The profile section renders correctly without overflows on viewports from 320px to 1440px wide.

## 12. Technical Findings

- The Summoner-V4 endpoint requires platform hosts (e.g. `br1.api.riotgames.com`) which are already resolved in `RiotApiClientAdapter` by `resolvePlatformHost(region)`.
- The `SyncPlayerProfileUseCase` should execute the Summoner API call sequentially after resolving the PUUID.

## 13. Development Guidance

- **PUUID Hash-based Seeding for Past Ranks:**
  Use a custom class or method in the backend to generate a list of past ranks:
  ```java
  long seed = (long) puuid.value().hashCode();
  Random random = new Random(seed);
  // Example algorithm:
  // Get current Solo/Duo rank tier. If unranked, pick a default base tier (e.g., SILVER).
  // Step down (or occasionally up) randomly per season to generate S2024, S2023, S2022.
  ```
- **CDN Paths:**
  - Summoner Icon URL: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/{profileIconId}.jpg`

## 14. Suggested Code Structure and Contracts

### Backend:
- `PastSeasonRank.java` (Domain model):
  ```java
  public record PastSeasonRank(String season, String tier, String rank) {}
  ```
- `RiotSummonerDto.java` (Integration DTO):
  ```java
  public record RiotSummonerDto(
      String id,
      String accountId,
      String puuid,
      int profileIconId,
      long revisionDate,
      long summonerLevel
  ) {}
  ```
- Add fields to `PlayerAnalyticsResponse.java` and `PlayerAnalytics.java`.

### Frontend:
- `PlayerAnalyticsResponse.ts`:
  ```typescript
  export interface PastSeasonRank {
    season: string;
    tier: string;
    rank: string | null;
  }

  export interface PlayerAnalyticsResponse {
    puuid: string;
    gameName: string;
    tagLine: string;
    region: string;
    profileIconId: number;
    summonerLevel: number;
    rankedQueues: RankedQueues;
    matches: MatchSummary[];
    pastSeasonRanks: PastSeasonRank[];
  }
  ```

## 15. Validation References

- **Backend tests:** Update mock setups in `SyncPlayerProfileUseCaseTest.java` to support `riotApiClientPort.fetchSummonerByPuuid` and assert mock past ranks generation.
- **Frontend tests:** Run `npm run test` or specific vitest commands on `AccountRankedSummary.test.tsx` checking:
  - Summoner icon is present.
  - Level badge is present.
  - Past seasons list is present.

## 16. Regression Risks

- **Riot API Rate Limits:** Fetching summoner details adds an extra API call. Caffeine caching mitigates this by retaining the full resolved `RiotAccount` object containing the `profileIconId` and `summonerLevel`.
- **CSS Flex Container Shifts:** Adapting `.identity` to use vertical column alignment on desktop must not break the tablet layout where elements should stretch horizontally.

## 17. Open Blockers and Pending Decisions

- None.

## 18. Readiness Checklist

- [x] The requested change is clear.
- [x] The expected behavior is documented.
- [x] The current behavior is documented or explicitly marked as unknown.
- [x] Relevant sources were reviewed.
- [x] Relevant code areas were reviewed.
- [x] Relevant tests were reviewed or absence was documented.
- [x] Relevant UI behavior was observed with Playwright MCP when applicable.
- [x] Relevant questions were asked one at a time.
- [x] User answers were documented.
- [x] Open blockers are documented.
- [x] Pending decisions are documented.
- [x] Development guidance is documented.
- [x] Expected code structure or contracts are documented.
- [x] Suggested validation scenarios are documented.

## 19. Structured Agent Reference

```json
{
  "spec": {
    "index": "010",
    "name": "summoner-icon-and-historical-ranks",
    "path": "docs/changes/010-summoner-icon-and-historical-ranks/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Add summoner profile icon, summoner level, and consistent mock past season ranks to the dashboard player profile card.",
    "sourceSummary": [
      {
        "type": "code",
        "reference": "src/main/frontend/src/features/dashboard/presentation/components/AccountRankedSummary.tsx",
        "purpose": "Analyze existing profile panel HTML structure and components."
      },
      {
        "type": "code",
        "reference": "src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java",
        "purpose": "Analyze where profile sync occurs to integrate SUMMONER-V4 and mocked history."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Riot Games API rate limits",
        "reason": "Adding SUMMONER-V4 endpoint query increases API call count, must be cached."
      }
    ],
    "userConfirmedDecisions": [
      "Simulate ranks consistently in the backend using a seed from PUUID",
      "SUMMONER-V4 integration for profileIconId and summonerLevel",
      "Display summoner photo vertically above nickname"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "AccountRankedSummary.test.tsx component rendering assertions",
      "SyncPlayerProfileUseCaseTest.java use-case mock assertions"
    ]
  }
}
```
