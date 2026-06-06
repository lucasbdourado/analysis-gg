# Task: Implement Riot ID Validation and Form State

## Status

Implemented

## Task ID

003

## Feature

`docs/features/riot-id-search-input/feature.md`

## Source Documents

- `docs/features/riot-id-search-input/feature.md`
- `docs/features/riot-id-search-input/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Wire the SearchForm states, apply Riot ID input validation, and manage interactive error tooltips.

## Context

The onboarding form must block invalid inputs. We need to implement state hooks to manage user inputs and trigger client-side regex checks upon submitting or focusing out, showing tooltips for errors.

## Scope

- Set up input states (`riotId`, `error`) inside `SearchForm`.
- Implement validation handler verifying presence and format matching regex: `^[a-zA-Z0-9\s_.-]{3,16}#[a-zA-Z0-9]{3,5}$`.
- Implement interactive error tooltip layout overlay triggered on invalid submit or input blur.
- Style tooltip using custom error colors (`hsl(350, 80%, 55%)`).

## Out of Scope

- Region server list definition and dropdown query mapping.
- Navigation redirections or URL query string construction.

## Depends On

`002-implement-shared-ui-components.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] Typing in input synchronizes text state and hides tooltips when active.
- [ ] Submitting empty input prevents form action and shows `"Riot ID is required"` tooltip.
- [ ] Submitting invalid string format (e.g. no `#`, too short name, too long tag) sets error state and shows `"Format must be Name#Tag"` tooltip.
- [ ] Valid formats clear error states and pass validation checkpoint.

## Implementation Notes

- Store the validation regex pattern in a shared helper module `src/shared/lib/validation/riotId.ts` to keep validation clean and isolated.
- Align with the state management guidelines in `.agents/docs/architecture/react-coding-guidelines/state-management.md`.

## Validation Notes

- Focus in and out of the form fields to manually trigger validation loops.
- Try submitting various valid and invalid formats to check validation blocks.

## Risks

- Regular expression rejecting valid Riot IDs containing dots or hyphens (mitigated by explicit regex pattern definition).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
