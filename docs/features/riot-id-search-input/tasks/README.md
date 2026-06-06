# Task Breakdown: Riot ID Search Input

## Status

Confirmed

## Product Name

Analysis.GG

## Feature Reference

`docs/features/riot-id-search-input/feature.md`

## Source Documents

- `docs/features/riot-id-search-input/feature.md`
- `docs/features/riot-id-search-input/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Task Strategy

The feature is split sequentially to enable clean, isolated steps:
1. Routing setup and component scaffolding.
2. Building and styling the shared visual elements.
3. Adding form states, validation regex, and interactive tooltip error feedback.
4. Integrating region platform configurations and executing the client-side redirect.
5. Unit testing all input states, errors, and redirection functions.
6. A final validation task (999) to verify the entire feature end-to-end.

## Task List

| Order | Task File | Goal | Status | Depends On | Blocking Reason |
|---|---|---|---|---|---|
| 001 | `001-setup-search-route-and-components.md` | Map application routes and scaffold page, form, and shared UI component files. | Ready | None | None |
| 002 | `002-implement-shared-ui-components.md` | Implement and style reusable `Input`, `Select`, and `Button` components using HSL dark-mode theme. | Depends on Previous Task | `001-setup-search-route-and-components.md` | None |
| 003 | `003-implement-riot-id-validation-and-form-state.md` | Manage form states, implement Riot ID regex checks, and show error tooltips. | Depends on Previous Task | `002-implement-shared-ui-components.md` | None |
| 004 | `004-implement-region-selector-and-redirect.md` | Load region metadata, populate selection dropdown, and execute url redirect. | Depends on Previous Task | `003-implement-riot-id-validation-and-form-state.md` | None |
| 005 | `005-add-search-form-unit-tests.md` | Add Vitest/RTL unit tests covering validation, tooltip visual cues, and routing targets. | Depends on Previous Task | `004-implement-region-selector-and-redirect.md` | None |
| 999 | `999-verify-feature-completion.md` | Validate the complete feature behavior end-to-end. | Depends on Previous Task | `005-add-search-form-unit-tests.md` | None |

## Suggested Execution Order

1. `001-setup-search-route-and-components.md`
2. `002-implement-shared-ui-components.md`
3. `003-implement-riot-id-validation-and-form-state.md`
4. `004-implement-region-selector-and-redirect.md`
5. `005-add-search-form-unit-tests.md`
6. `999-verify-feature-completion.md`

## Blocked Tasks

| Task File | Blocking Reason | Required Action |
|---|---|---|
| None | None | None |

## Dependency Notes

- Each task builds directly on the layout and code of the previous one. Ensure tests and styling remain isolated to their respective modules.

## Notes for Plan Task

- Plan one task at a time.
- Read the task file and its source documents before creating a task implementation plan.
- Do not plan blocked tasks until their blocking reason is resolved.

## Notes for Execute Task

- Execute only from an approved task implementation plan.
- Validate each task against its acceptance criteria.
- Do not mark the feature complete until `999-verify-feature-completion.md` is satisfied.
