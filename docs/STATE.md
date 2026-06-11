# Project State

## Current Change Context

- Active change: None
- Spec path: None
- Open blockers:
  - None
- Pending decisions:
  - None

## Change History

### 015 - Interactive Daily Performance Filtering and Multi-Select

- Spec path: `docs/changes/015-interactive-daily-performance-filtering-and-multi-select/change-spec.md`
- Status: Implemented
- Created from: User request, dashboard component cross-filtering redesign, and multi-select interaction design
- Summary: Research and spec for making activity cells in DailyPerformanceGrid interactive to filter by specific calendar date, and upgrading all dashboard selection filters (roles, weekdays, calendar dates) to support direct-click multi-selection.
- Open blockers:
  - None
- Pending decisions:
  - None

### 014 - Interactive Weekday Filtering

- Spec path: `docs/changes/014-interactive-weekday-filtering/change-spec.md`
- Created from: User request, dashboard component cross-filtering design, and Recharts interaction planning
- Summary: Research and spec for making day bars in WeekdayWinRateChart interactive, filtering downstream widgets by selected weekday and/or role, and highlighting selected day with gold.
- Open blockers:
  - None
- Pending decisions:
  - None

### 013 - Interactive Role Filtering and Ranks Relayout

- Spec path: `docs/changes/013-interactive-role-filtering-and-ranks-relayout/change-spec.md`
- Created from: User request, dashboard component research, and context/page/widget interaction design
- Summary: Research and development spec for moving past ranks below the current rank in the profile panel, and adding click-to-filter role interactions to update downstream widgets.
- Open blockers:
  - None
- Pending decisions:
  - None

### 012 - Reorganize Dashboard Charts

- Spec path: `docs/changes/012-reorganize-dashboard-charts/change-spec.md`
- Created from: User request, OP.GG/U.GG layout references, and CSS grid layout research
- Summary: Research and spec for converting Route Performance to a play-count-sorted role list and reorganizing the dashboard widgets into a 2-column grid to prevent squishing.
- Open blockers:
  - None
- Pending decisions:
  - None

### 011 - Summoner Splits and Role Win Rates

- Spec path: `docs/changes/011-summoner-splits-and-role-win-rates/change-spec.md`
- Created from: User request, Riot API mapping analysis, and Recharts integration research
- Summary: Research and development spec for displaying split-by-split past season ranks and a new route performance win rate chart with Clash icons.
- Open blockers:
  - None
- Pending decisions:
  - None

### 010 - Summoner Icon and Historical Ranks

- Spec path: `docs/changes/010-summoner-icon-and-historical-ranks/change-spec.md`
- Created from: User request, Riot API client research, and profile component structure analysis
- Summary: Research and development spec for displaying profile icon, level overlay, and mock past season ranks.
- Open blockers:
  - None
- Pending decisions:
  - None

### 009 - Compact Profile Dashboard

- Spec path: `docs/changes/009-compact-profile-dashboard/change-spec.md`
- Created from: User request, dashboard frontend code research, and web comparison against OP.GG, U.GG, and Blitz.gg profile pages
- Summary: Research and development spec for making the dashboard profile-first, compact, and less vertically dense while keeping the existing analytics data flow.
- Open blockers:
  - Browser-based local UI observation could not be completed in this session.
- Pending decisions:
  - None

### 007 - Recent Match History Section

- Spec path: `docs/changes/007-recent-match-history-section/change-spec.md`
- Created from: User request, dashboard frontend code research, backend code research, and OP.GG web reference
- Summary: Research and development spec for adding a compact recent match history section that reuses the match list already returned by the API.
- Open blockers:
  - None
- Pending decisions:
  - None

### 006 - Player Profile Section

- Spec path: `docs/changes/006-player-profile-section/change-spec.md`
- Created from: User request and follow-up decisions, dashboard frontend code research, and attempted browser observation
- Summary: Research and development spec for moving the profile/rank summary into a dedicated section below the filters and above the charts, with official Riot rank emblems.
- Open blockers:
  - None
- Pending decisions:
  - None

### 005 - User Ranked Summary

- Spec path: `docs/changes/005-user-ranked-summary/change-spec.md`
- Created from: User request, Riot API documentation, backend code research, frontend code research, and attempted Playwright MCP observation
- Summary: Research and development spec for adding a compact dashboard summary with selected region flag and official Solo/Duo and Flex ranked status from Riot League-v4 by PUUID.
- Open blockers:
  - None
- Pending decisions:
  - None

### 004 - Runeterra Arena Design System

- Spec path: `docs/changes/004-runeterra-arena-design-system/change-spec.md`
- Created from: User request, design system research, and Playwright browser observation
- Summary: Research and spec for applying the Runeterra Arena design system, importing Google Fonts, removing fixed-width wrapper, and updating component styling.
- Open blockers:
  - None
- Pending decisions:
  - None

### 003 - API-Driven Match Filtering

- Spec path: `docs/changes/003-api-driven-match-filtering/change-spec.md`
- Created from: User request, backend analysis, and frontend hooks refactoring
- Summary: Research and development spec for API-driven match filtering with parallel requests.
- Open blockers:
  - None
- Pending decisions:
  - None

### 001 - Match Type Filtering

- Spec path: `docs/changes/001-match-type-filtering/change-spec.md`
- Created from: User request, backend analysis, and Playwright MCP observation
- Summary: Research and development spec for client-side match type filtering on the dashboard page.
- Open blockers:
  - None
- Pending decisions:
  - None

### 002 - Weekday Chart and Filter Fixes

- Spec path: `docs/changes/002-weekday-chart-and-filter-fixes/change-spec.md`
- Created from: User request, calculation audit, and Playwright MCP verification
- Summary: R&D spec for fixing match filtering ordering and Recharts Wednesday label rendering.
- Open blockers:
  - None
- Pending decisions:
  - None
