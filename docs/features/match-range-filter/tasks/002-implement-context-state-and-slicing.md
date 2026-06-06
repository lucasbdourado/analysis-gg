# Task: Implement Context State and Slicing

## Status

Implemented


## Task ID

002

## Feature

`docs/features/match-range-filter/feature.md`

## Source Documents

- `docs/features/match-range-filter/feature.md`
- `docs/features/match-range-filter/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Implement the `DashboardProvider` state management, the client-side slicing logic, and the custom consumer hook `useDashboard`.

## Context

The React Context must actively manage the active range filter state, derive the filtered match array based on the active selection, and provide a safe hook for children components to consume this state.

## Scope

- Implement `DashboardProvider` component in `src/features/dashboard/presentation/context/DashboardContext.tsx`.
  - Accept `rawData` as prop and children as React nodes.
  - Declare state `activeRange` using `useState` initialized to default 20.
  - Implement `filteredMatches` using `useMemo` with `rawData` and `activeRange` as dependencies.
  - Implement slicing formula: `rawData.slice(0, Math.min(rawData.length, activeRange))`.
  - Handle null, undefined, or empty arrays safely.
- Implement and export custom hook `useDashboard`.
  - Throw an error if context is consumed outside of `DashboardProvider`.

## Out of Scope

- Creating the selector component or styles.
- Integrating provider into layout.
- Updating widgets.

## Depends On

`001-setup-dashboard-context-and-scaffolding.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] `DashboardProvider` manages `activeRange` and updates it correctly via `setActiveRange`.
- [ ] `filteredMatches` derived array matches the expected sliced count (maximum `activeRange` items).
- [ ] Custom hook `useDashboard` correctly resolves the context state and throws errors when consumed outside the provider.
- [ ] Edge cases (empty arrays, undefined values) are handled gracefully without application crashes.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Write a small scratch check or compile check to verify the file compiles without type errors.

## Risks

- Performance bottlenecks if `useMemo` is omitted or if dependencies are not correctly specified.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
