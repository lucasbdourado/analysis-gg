# Task Decision: Match Summary Interface Location

## Status

Status: Confirmed

Last updated: 2026-06-06

Decision file: `docs/features/match-range-filter/decisions/001-match-summary-location.md`

## Task Reference

Task ID: `001`

Task file: `docs/features/match-range-filter/tasks/001-setup-dashboard-context-and-scaffolding.md`

Task plan file: `docs/features/match-range-filter/task-plans/001-setup-dashboard-context-and-scaffolding-plan.md`

Feature: `match-range-filter`

## Context

To structure the dashboard client-side filter and presentation layer, we need to define the `MatchSummary` TypeScript interface that maps the match objects returned by the backend. We need to decide where this interface will be located to ensure correct package layout and separation of concerns.

## Decision Needed

Where should the `MatchSummary` TypeScript interface be defined in the frontend project?

## Options Considered

| Option | Summary | Trade-offs |
| --- | --- | --- |
| **Option 1**: Directly in the context file | Define inside `DashboardContext.tsx`. | Simple, but pollutes the presentation context with core domain models, violating layer separation. |
| **Option 2**: In a dedicated domain file | Define in `src/main/frontend/src/features/dashboard/domain/MatchSummary.ts`. | Keeps domain model types separated from UI/Presentation React logic, following project guidelines. |

## User Decision

Confirmed Option 2: Define the interface in `src/main/frontend/src/features/dashboard/domain/MatchSummary.ts`.

## Rationale

This decision adheres to the project's React clean architecture guidelines (`.agents/docs/architecture/react-coding-guidelines/project-structure.md`), which state that `features/<feature>/domain` should contain types, models, and pure entities of the feature, keeping them independent of React UI/Context concerns.

## Impact

We will create the directory `src/main/frontend/src/features/dashboard/domain/` if it does not exist, and place `MatchSummary.ts` there. `DashboardContext.tsx` will import `MatchSummary` using relative paths.

## Date

Decision date: 2026-06-06

## Notes

No external ADR is required as this is a local feature architecture layout implementation detail.
