# Task: Integrate Filter into Dashboard

## Status

Done

## Task ID

004

## Feature

`docs/features/match-range-filter/feature.md`

## Source Documents

- `docs/features/match-range-filter/feature.md`
- `docs/features/match-range-filter/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Wrap the `DashboardPage` layout inside the `DashboardProvider` and mount the `MatchRangeFilter` component in the header.

## Context

The main dashboard page acts as the layout container. We need to wrap it in the state provider and insert the selector dropdown in the header layout to expose the active filter to all children widgets.

## Scope

- Modify `src/features/dashboard/presentation/pages/DashboardPage.tsx`.
  - Import `DashboardProvider` and `MatchRangeFilter`.
  - Wrap the page body inside `<DashboardProvider rawData={rawData}>` where `rawData` is the match history array fetched from the backend API.
  - Mount `<MatchRangeFilter />` in the dashboard header layout.

## Out of Scope

- Optimizing the widgets' internal calculations to use the filtered data (this is done in Task 005).

## Depends On

`003-create-range-filter-component.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] `DashboardPage` successfully mounts and compiles with `DashboardProvider`.
- [x] Dropdown seletor is visible in the page header.
- [x] Changing dropdown selection updates the context provider state without errors.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Run local compilation check to verify that imports and JSX structures are correct.

## Risks

- Breaking the existing layout structure of the dashboard if the header wrapper elements are not configured correctly.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
