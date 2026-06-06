# Task: Create Range Filter Component

## Status

Implemented

## Task ID

003

## Feature

`docs/features/match-range-filter/feature.md`

## Source Documents

- `docs/features/match-range-filter/feature.md`
- `docs/features/match-range-filter/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create the `MatchRangeFilter` selector dropdown component and style it using CSS Modules based on Obsidian design tokens.

## Context

An interactive dropdown selector is needed in the dashboard header. It must consume the dashboard context, render options (20, 50, 100) with dynamic labels, and style them to fit the dark-mode layout of the page.

## Scope

- Create component file `src/features/dashboard/presentation/components/MatchRangeFilter.tsx`.
  - Consume context state (`activeRange`, `setActiveRange`, and `rawData`).
  - Render selector elements with option values `20`, `50`, and `100`.
  - Implement dynamic label rendering:
    - If `rawData.length < optionValue`, display `"Last " + optionValue + " (" + rawData.length + " available)"`.
    - Else, display `"Last " + optionValue`.
- Create styling sheet `src/features/dashboard/presentation/components/MatchRangeFilter.module.css`.
  - Apply custom dark-mode variables from `index.css` (glow, borders, gradients).
  - Add smooth transitions on hover/focus.

## Out of Scope

- Mounting component onto `DashboardPage`.
- Altering visual chart elements.

## Depends On

`002-implement-context-state-and-slicing.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [ ] `MatchRangeFilter` component renders a select element or styled button group with options 20, 50, and 100.
- [ ] Option labels dynamically adjust to show available count when the player's total match list length is less than the option.
- [ ] Dropdown options remain clickable and successfully trigger context updates.
- [ ] CSS module styles are applied correctly with class names isolated to the component.

## Implementation Notes

- Follow the confirmed stack and constraints from `docs/architecture/analysis-gg/technology-definition.md`.
- Keep the work limited to this feature and task scope.
- Do not introduce new architecture, libraries, persistence, API contracts, or product behavior unless already defined in the source documents.
- If implementation requires an undocumented decision, keep the task blocked or defer the decision to `plan-task`.

## Validation Notes

- Run style compiler checks to ensure CSS is imported properly and complies with standard syntax.

## Risks

- Layout displacement on small screen widths due to longer label strings (e.g. "Last 100 (15 available)"). Ensure the element handles text overflow safely.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
