# Implementation Plan: Throttling Riot API, Color Contrast & Text Visibility Fixes, and Premium Styling

This plan aims to resolve the backend rate-limit (HTTP 429) errors and address major text readability issues on the frontend (dark text rendering on dark backgrounds under light mode), while elevating the landing page styling to a premium obsidian theme.

## User Review Required

> [!IMPORTANT]
> **Enforcing Global Dark Obsidian Theme**: Currently, the dashboard container has a dark gradient background, but text colors (`--text` and `--text-h`) default to dark purple/black when the browser is in **light mode**. This makes dashboard text completely invisible. We will fix this by enforcing the dark obsidian theme globally across the entire application, making background and text colors consistent and fully visible.

> [!IMPORTANT]
> **Backend Throttling**: The backend changes introduce a semaphore-based concurrency limit (5 parallel requests) and a 50ms task-spacing delay for match ingestion virtual threads. Combined with a retry loop using exponential backoff in the client adapter, this completely mitigates the rate limit issues of the developer Riot API key (20 req/1s, 100 req/2min).

---

## Proposed Changes

### Backend: Riot API Throttling & Retry

#### [MODIFY] [RiotApiClientAdapter.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/adapter/out/integration/RiotApiClientAdapter.java)
- Implement a helper method `executeWithRetry(Supplier<T> requestSupplier)` which catches `RateLimitExceededException` (thrown on 429 status) and retries requests using exponential backoff (e.g., retrying up to 3 times, sleeping 1000ms, then 2000ms).
- Wrap all public client methods (`resolvePuuid`, `fetchMatchIds`, `fetchMatchDetail`) in `executeWithRetry` to make them resilient to intermittent 429 errors.

#### [MODIFY] [SyncPlayerProfileUseCase.java](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java)
- In the virtual-thread match-fetching loop, instantiate a `Semaphore(5)` to restrict concurrent active API calls to a maximum of 5.
- Introduce a short spacing delay (`Thread.sleep(50)`) between submitting each match ingestion task to prevent firing 100 requests in the same microsecond.

---

### Frontend: Color Contrast, Text Visibility, and Premium Styling

#### [MODIFY] [index.css](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/index.css)
- Refactor the design system variables to enforce a dark obsidian theme globally (forcing background to use the dark obsidian gradient and text to use light/gray colors by default).
- Remove the `prefers-color-scheme: light` override that causes dark text on a dark background.

#### [MODIFY] [SearchLandingPage.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/pages/SearchLandingPage.tsx)
- Re-structure the landing page markup using semantic HTML.
- Apply a glassmorphic container card and style the title/subtitle using standard classes.
- Import the new module CSS for layouts.

#### [NEW] [SearchLandingPage.module.css](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/pages/SearchLandingPage.module.css)
- Implement full-screen dark gradient background matching the obsidian theme tokens.
- Add animation transitions and a centered glassmorphic login/search card with subtle glow and borders.
- Style the subtitle and branding.

#### [MODIFY] [SearchForm.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/components/SearchForm.tsx)
- Modify the form to support a structured flex/grid layout for inputs, select, and button.

#### [MODIFY] [SearchForm.module.css](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/search/presentation/components/SearchForm.module.css)
- Implement responsive form layout (horizontal flex on desktop, vertical stack on mobile).
- Add spacing, gap, hover effects, and align error messaging cleanly below the inputs.

---

## Verification Plan

### Automated Tests
- Run backend maven test suite to ensure all 89 unit/integration tests still pass:
  ```powershell
  .\mvnw.cmd test
  ```
- Run frontend vitest test suite to ensure all 32 unit tests still pass:
  ```powershell
  npx.cmd vitest run
  ```

### Manual Verification
- Start both backend and frontend servers:
  - Backend: `.\mvnw.cmd spring-boot:run`
  - Frontend: `npm.cmd run dev`
- Open the application at `http://localhost:5173/` using Playwright:
  - Verify that dashboard text is clearly legible (light text on dark background) regardless of system theme.
  - Check the visual aesthetics of the landing page.
  - Test validation errors.
  - Search for an active player (e.g., `Hide on bush#KR1` on region `Korea`) to verify that the 100 matches ingest without triggering a 429 rate limit block.
  - Verify that dashboard charts and tables populate successfully.
