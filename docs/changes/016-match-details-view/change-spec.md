# Change Spec: Match Details View

## 1. Overview

This change specifies the implementation of a dedicated match detail page in the frontend and a matching REST endpoint in the backend. When a user clicks a match in their history list, they will be navigated to a detailed page displaying the match overview, teams division (Blue vs Red), players, items, CS, KDA, runes, and spells of all 10 participants. Feitiços (Spells) and Runas (Runes) will be resolved on the frontend using JSON files acting as metadata databases.

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

- User request: "Agora quero acessar cada uma das minhas partidas e ter uma vista totalmente detalhada, mas por enquanto vamos focar no overview da partida, jogadores, itens, cs KDA, Runas e spells"
- User choice on layout: New route/page (`/match/:matchId`) instead of an accordion list.
- User choice on endpoint: Backend endpoint `/api/match/{matchId}?region={region}`.
- User choice on Runes/Spells metadata: Resolving through JSON files on the frontend.
- Related files:
  - [RiotApiController.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiController.java)
  - [RiotApiWebMapper.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/in/web/RiotApiWebMapper.java)
  - [MatchSummary.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/domain/model/MatchSummary.java)
  - [RiotMatchDto.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/dto/RiotMatchDto.java)
  - [RiotMatchMapper.java](file:///home/lucas-dourado/projects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/mapper/RiotMatchMapper.java)
  - [routes.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/app/routes.tsx)
  - [RecentMatchHistory.tsx](file:///home/lucas-dourado/projects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/RecentMatchHistory.tsx)

## 4. Confirmed Facts

- The frontend utilizes React Router DOM's `createBrowserRouter` for pages routing.
- The backend relies on a Caffeine-based cache (`PlayerProfileCachePort`) to cache match data.
- The `RiotMatchMapper` maps `RiotMatchDto` from Riot Match-V5.
- The backend ignores unknown properties during deserialization.

## 5. Inferences and Assumptions

- A single, dedicated backend endpoint `/api/match/{matchId}?region={region}` is sufficient to return full match detail.
- Caffeine cache will store the detailed `MatchSummary` (now containing all participants), meaning `/api/match/{matchId}` can load directly from the cache if the player profile has already been synchronized, minimizing Riot API rate-limit consumption.
- Runes and spells JSON files will be located in the frontend src directory to be bundled correctly by Vite.

## 6. Questions and Answers

- **Question 1**: Should the detail view be an accordion/dropdown in the list or a separate page?
  - **Answer**: Nova página ou rota.
  - **Effect**: Add new route `/match/:matchId` and new page component.
- **Question 2**: Add a backend endpoint `/api/match/{matchId}`?
  - **Answer**: Concordo.
  - **Effect**: Implement GET `/api/match/{matchId}` in the controller.
- **Question 3**: Resolve runes/spells via static mappings or JSON file?
  - **Answer**: Um arquivo JSON.
  - **Effect**: Store `runes.json` and `spells.json` in the frontend source tree.

## 7. Current Behavior

- Click on matches in `RecentMatchHistory` has no effect.
- `MatchSummary` contains statistics for only the queried participant.
- The backend lacks an endpoint to fetch detailed data for a specific match ID.

## 8. Expected Behavior

- Users can click on a match row in `RecentMatchHistory`, redirecting them to `/match/:matchId?region=br1&name=Lucas&tag=BR1`.
- The new detailed page loads, fetches details from `/api/match/{matchId}?region=br1`, and renders a structured view.
- Overview details displayed: game outcome (Win, Loss, Remake), game mode, date, match duration.
- Participants division: Blue Team (top 5) and Red Team (bottom 5).
- For each participant: champion icon, summoner spells, primary/secondary runes, nickname, KDA, CS + CS/min, and items (item0 to item5 + trinket item6).
- Search player is highlighted/bolded.
- A "Back to Dashboard" button navigates back to `/dashboard?name=Lucas&tag=BR1&region=br1`.

## 9. Scope

- **Backend**:
  - Add fields in `RiotMatchDto.ParticipantDto` to fetch items (`item0` through `item6`), perk styles (runes), summoner spells (`summoner1Id`, `summoner2Id`), and identifiers (`summonerName`, `riotIdGameName`, `riotIdTagline`).
  - Create `ParticipantSummary` domain model and add `List<ParticipantSummary> participants` to `MatchSummary` (or create a separate `MatchDetail` domain model).
  - Update `RiotMatchMapper` to parse and map all participants.
  - Implement `/api/match/{matchId}` endpoint in `RiotApiController.java`.
- **Frontend**:
  - Place `runes.json` and `spells.json` metadata files in the assets folder.
  - Add `/match/:matchId` route and implement `MatchDetailPage.tsx` and its CSS module.
  - Make `RecentMatchHistory.tsx` items clickable links to `/match/:matchId`.

## 10. Out of Scope

- Damage charts, gold charts, or role comparison graphs are deferred for future updates.
- Normal and Custom match modes details that go beyond Riot's default participant parameters.

## 11. Functional Acceptance Criteria

- Navigation: Clicking a match redirects to `/match/:matchId?...` and clicking "Back to Dashboard" returns to the correct dashboard state.
- Standalone Load: Typing `/match/{matchId}?region={region}` directly into the URL bar loads the details page correctly.
- Layout: 2 team lists (Blue Team / Red Team) are rendered.
- Data completeness: All 10 players show champion, spells, runes, name, KDA, CS, and items.
- Formatting: Winning team marked as victory, losing team as defeat. Remakes shown as Remake. CS/min is calculated as `(totalMinions + neutralMinions) / (durationInSeconds / 60)`.
- Highlighting: The active summoner is highlighted/bolded.

## 12. Technical Findings

- Standard Riot CDN URLs:
  - Champion: `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/champion/{championName}.png`
  - Item: `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/item/{itemId}.png`
  - Spells: `https://ddragon.leagueoflegends.com/cdn/16.11.1/img/spell/{spellName}.png`
  - Runes: `https://ddragon.leagueoflegends.com/cdn/img/{runePath}`
- Vite automatically supports JSON imports (e.g. `import runesData from '../../assets/data/runes.json'`).

## 13. Development Guidance

- If `itemId` is `0`, render an empty slot styling (dark box with border) instead of failing.
- Keep runes/spells JSON schema minimal to reduce size:
  - Runes: Map ID to relative icon paths.
  - Spells: Map ID to spell asset names (e.g. `4` -> `SummonerFlash`).

## 14. Suggested Code Structure and Contracts

### Backend Model changes
```java
public record ParticipantSummary(
    String puuid,
    String gameName,
    String tagLine,
    int championId,
    String championName,
    boolean win,
    int kills,
    int deaths,
    int assists,
    int totalMinionsKilled,
    int neutralMinionsKilled,
    String teamPosition,
    int teamId,
    int summoner1Id,
    int summoner2Id,
    int item0,
    int item1,
    int item2,
    int item3,
    int item4,
    int item5,
    int item6,
    int primaryStyleId,
    int subStyleId,
    int keystoneId
) {}
```

### GET `/api/match/{matchId}?region={region}` response contract
```json
{
  "matchId": "BR1_12345",
  "gameDuration": 1800,
  "gameCreation": 1620000000000,
  "queueId": 420,
  "win": true,
  "championId": 103,
  "championName": "Ahri",
  "kills": 8,
  "deaths": 2,
  "assists": 10,
  "totalMinionsKilled": 180,
  "neutralMinionsKilled": 4,
  "teamPosition": "MIDDLE",
  "participants": [
    {
      "puuid": "puuid-1",
      "gameName": "Lucas",
      "tagLine": "BR1",
      "championId": 103,
      "championName": "Ahri",
      "win": true,
      "kills": 8,
      "deaths": 2,
      "assists": 10,
      "totalMinionsKilled": 180,
      "neutralMinionsKilled": 4,
      "teamPosition": "MIDDLE",
      "teamId": 100,
      "summoner1Id": 4,
      "summoner2Id": 12,
      "item0": 1001,
      ...
      "primaryStyleId": 8000,
      "subStyleId": 8100,
      "keystoneId": 8008
    },
    ...
  ]
}
```

## 15. Validation References

- **Unit Tests**:
  - `RiotMatchMapperTest`: Verify mapping of all participants, runes styles, spells, and items.
- **Integration Tests**:
  - `RiotApiIntegrationTest`: Verify the `/api/match/{matchId}` REST response structure and cache retrieval behavior.
- **Manual Verification**:
  - Click on a match and verify routing.
  - Verify that F5 fetches details correctly.
  - Verify layout responsiveness and color styles (Blue/Red).

## 16. Regression Risks

- Riot API Rate Limit: Requests to `/api/match/{matchId}` must fetch from cache when possible. `SyncPlayerProfileUseCase` caches matches in Caffeine during synchronization, ensuring that `/api/match/{matchId}` hits the cache if called shortly after dashboard load.

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
    "index": "016",
    "name": "match-details-view",
    "path": "docs/changes/016-match-details-view/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Create a new route /match/:matchId displaying detailed information of the 10 players, items, CS, KDA, spells, and runes from a JSON file.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "user query",
        "purpose": "Define requirements"
      },
      {
        "type": "code",
        "reference": "RecentMatchHistory.tsx",
        "purpose": "Analyze navigation trigger"
      },
      {
        "type": "code",
        "reference": "RiotApiController.java",
        "purpose": "Understand REST controller"
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Vanilla CSS must be used",
        "reason": "Project styling constraint"
      },
      {
        "constraint": "Cache must be used for match details",
        "reason": "Avoid rate limit exhaust"
      }
    ],
    "userConfirmedDecisions": [
      "New routing instead of accordion",
      "Dedicated REST endpoint /api/match/{matchId}",
      "Runes and spells details resolved on frontend using JSON file"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Endpoint loading correctness",
      "Highlighting queried player",
      "Responsive Blue vs Red layout"
    ]
  }
}
```
