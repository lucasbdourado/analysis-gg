# Task: Implement Shared UI Components

## Status

Depends on Previous Task

## Task ID

002

## Feature

`docs/features/riot-id-search-input/feature.md`

## Source Documents

- `docs/features/riot-id-search-input/feature.md`
- `docs/features/riot-id-search-input/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Implement and style the reusable shared UI components (`Input`, `Select`, `Button`) using HSL-based dark mode tokens.

## Context

To build the visual landing page, we need modular, styled input fields, selects, and buttons. These components must leverage isolated styling (CSS Modules) and define premium HSL states (hover, focus, error triggers).

## Scope

- Implement `Input` component at `src/shared/ui/Input/Input.tsx` and its CSS module.
- Implement `Select` component at `src/shared/ui/Select/Select.tsx` and its CSS module.
- Implement `Button` component at `src/shared/ui/Button/Button.tsx` and its CSS module.
- Define global styling variables (dark obsidian, neon gradients, error red) in `src/index.css` as designed in the Tech Spec.

## Out of Scope

- Implementing the main search form's validation regex.
- Implementing routing navigation logic or redirect parameters.
- Writing unit tests.

## Depends On

`001-setup-search-route-and-components.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] Reusable `Input` supports Controlled Value, focus glows, and error outline borders.
- [ ] Reusable `Select` supports populated options and modern dropdown caret styling.
- [ ] Reusable `Button` supports gradient hovers and disabled opacity states.
- [ ] Visual look follows the premium dark-mode HSL system (obsidian backdrops, neon overlays).

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Styling must use custom Vanilla CSS modules without utility overrides like Tailwind.

## Validation Notes

- Mount components in isolation or in the scaffolded landing page to manually verify responsive rendering and state styling.

## Risks

- Style name conflicts across components (mitigated by using `*.module.css` local scoping).

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
