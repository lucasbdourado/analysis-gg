# Task: Add Search Form Unit Tests

## Status

Done

## Task ID

005

## Feature

`docs/features/riot-id-search-input/feature.md`

## Source Documents

- `docs/features/riot-id-search-input/feature.md`
- `docs/features/riot-id-search-input/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create comprehensive unit tests verifying form rendering, validation checks, error message highlights, and redirection logic.

## Context

To secure the quality of the onboarding form, we must write automated unit tests ensuring the input fields, error handling, validation constraints, and routing callbacks work as specified under different inputs.

## Scope

- Create a test file `src/features/search/presentation/components/SearchForm.test.tsx` (using Vitest and React Testing Library).
- Test that components (Input, Select, Button) render correctly.
- Test that empty submit triggers validation block and shows `"Riot ID is required"`.
- Test that malformed Riot ID inputs (e.g. missing `#`, invalid tagline length) block submit and display `"Format must be Name#Tag"`.
- Test that valid submissions clear errors and trigger redirection with encoded parameters.

## Out of Scope

- E2E testing of the actual Riot API backend integration.

## Depends On

`004-implement-region-selector-and-redirect.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Unit tests cover all key execution paths (empty, invalid format, valid format).
- [x] Mocks verify that the routing hook (`useNavigate`) is triggered with correctly formatted query paths.
- [x] Test commands run and pass successfully in the test environment.

## Implementation Notes

- Utilize `@testing-library/react` and `@testing-library/user-event` to simulate user interactions.
- Follow testing guidelines specified in `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md`.

## Validation Notes

- Run tests locally using command line (e.g., `npm run test` or standard Vitest run configurations).

## Risks

- Mocking React Router context correctly inside testing wrappers.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
