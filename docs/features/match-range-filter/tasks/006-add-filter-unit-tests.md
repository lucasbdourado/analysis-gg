# Task: Add Filter Unit Tests

## Status

Depends on Previous Task

## Task ID

006

## Feature

`docs/features/match-range-filter/feature.md`

## Source Documents

- `docs/features/match-range-filter/feature.md`
- `docs/features/match-range-filter/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Add Vitest unit tests verifying slicing calculations and dynamic labeling states.

## Context

To ensure the filter calculations are correct and do not regress in the future, we must write automated unit tests covering different match history sizes and label formats.

## Scope

- Create a test file `src/features/dashboard/presentation/context/DashboardContext.test.tsx` (or inside the project's dedicated test directory).
- Write tests verifying:
  - Slicing output lengths under different input lengths (e.g. 15 matches, 35 matches, 100 matches).
  - Proper dynamic labeling logic output strings (e.g. verifying option `50` yields `"Last 50 (35 available)"` when raw matches count is 35).
  - State changes in Context when `setActiveRange` is called.

## Out of Scope

- Testing Riot API endpoints or Spring Boot backend logic.
- E2E browser automation tests (like Playwright).

## Depends On

`005-optimize-widgets-memoization.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] All written unit tests execute and pass successfully.
- [ ] Test coverage includes 0 matches, fewer matches than filter limit, and more matches than filter limit.
- [ ] Dropdown label formatting logic is covered under multiple scenarios.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Execute test suite (`npm run test` or `vitest run`) and verify outputs.

## Risks

- Incorrectly mocking context providers in tests, yielding false positives.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
