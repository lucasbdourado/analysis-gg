# Task Implementation Plan: Create Range Filter Component

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/match-range-filter/task-plans/003-create-range-filter-component-plan.md`

## Task Reference

Task ID: `003`

Task file: `docs/features/match-range-filter/tasks/003-create-range-filter-component.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `match-range-filter`

Feature file: `docs/features/match-range-filter/feature.md`

Feature Tech Spec: `docs/features/match-range-filter/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/match-range-filter/tasks/003-create-range-filter-component.md` | Scope & Acceptance Criteria | Confirmed | Defines component and styling scope |
| Feature file | `docs/features/match-range-filter/feature.md` | Feature Goal & Completion Criteria | Confirmed | Context on range filtering |
| Feature Tech Spec | `docs/features/match-range-filter/tech-spec.md` | Dropdown Option Label Resolution | Confirmed | Details option label formatting |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed | Confirms React + TS + CSS Modules |

## Planning Scope

This planning session covers only Task 003: creating the `MatchRangeFilter` component and its styling module. It does not cover mounting the component on the Dashboard page (Task 004), widget optimization (Task 005), or unit test writing (Task 006).

## Task Summary

Create the `MatchRangeFilter` selector dropdown component, implementing dynamic range labels based on match availability, and style it with a premium dark-mode look using CSS Modules and Obsidian design tokens.

## Execution Eligibility

Status: Eligible

Reason:
- The dependency `002-implement-context-state-and-slicing.md` has already been completed (as confirmed by `docs/STATE.md` and the implementation of `DashboardContext.tsx` and its slicing logic).

## Feature Context

To allow users to view short-term vs long-term trends on the dashboard, we need a selector in the header to change the number of analyzed games. This task implements the visual dropdown element that interacts with the `DashboardContext` to update the active game range.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Dropdown Option Label Resolution | Full | Yes | Implements $N < X$ and $N \ge X$ label templates |
| State and Error Handling | Partial | Yes | Implements disabled dropdown for empty/loading state |
| Modules and Responsibilities | Partial | Yes | Implements the `MatchRangeFilter` component UI |

Coverage assessment:
- **Justifying Tech Spec section**: `Dropdown Option Label Resolution` & `State and Error Handling`
- **Tech Spec sections implemented by this task**: `MatchRangeFilter` selector component, styling sheet.
- **Gaps between task and Tech Spec**: None.
- **Dependencies not specified by the Tech Spec**: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | The component will be built as a functional React component with TypeScript type definitions. |
| React Context API | `technology-definition.md` | The component will consume the `useDashboard` hook to retrieve state (`rawData`, `activeRange`) and updater (`setActiveRange`). |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Styling will be scoped to the component using a `.module.css` stylesheet. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | UI Component Structure | Component is a Presentational/Smart bridge; it consumes a local hook and renders UI without calling APIs. |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS Scoping | Requires using CSS Modules and Obsidian design tokens from `index.css` (avoiding inline styles). |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Match Summary Interface Location | `docs/features/match-range-filter/decisions/001-match-summary-location.md` | Establishes domain/presentation layout coordinates. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` | Exported hook and state types | Checked properties available to consume | Exposes `rawData`, `activeRange`, `setActiveRange` |
| `src/main/frontend/src/features/search/presentation/components/` | Component structure and styling imports | Style consistency reference | Uses `import styles from './[Name].module.css'` |
| `src/main/frontend/src/index.css` | Custom dark-theme variables | Token reference | Identifies `--card-bg`, `--card-border`, `--accent-cyan`, `--focus-glow`, etc. |

## Confirmed Scope

- Create a functional component `MatchRangeFilter` at `src/features/dashboard/presentation/components/MatchRangeFilter.tsx`.
- Consume `activeRange`, `setActiveRange`, and `rawData` from `useDashboard` context.
- Render a `<select>` element with a unique testing ID `match-range-select`.
- Dynamically build option labels for 20, 50, and 100 matches:
  - If `rawData.length < optionValue`, display `"Last " + optionValue + " (" + rawData.length + " available)"`.
  - Else, display `"Last " + optionValue`.
- Handle the case where `rawData.length === 0` (loading/empty states) by disabling the select element and rendering a single option "No matches available".
- Create `MatchRangeFilter.module.css` stylesheet containing scoped classes for the container, label, select dropdown, hover/focus transitions, and disabled states.
- Ensure the dropdown handles text overflow safely on narrow screens.

## Out of Scope

- Mounting the component into `DashboardPage.tsx` (Task 004).
- Modifying dashboard widgets or charts (Task 005).
- Writing Vitest unit tests (Task 006).

## Proposed Implementation Approach

1. **Directories**: Verify or create the presentation components directory under dashboard feature.
2. **Component Logic**:
   - Extract `rawData`, `activeRange`, `setActiveRange` from `useDashboard()`.
   - Safely resolve the total matches count (guarding against null or undefined `rawData` by defaulting to `[]`).
   - Define a static options list `[20, 50, 100]`.
   - Render a labelled select element. If total matches count is 0, render a disabled select displaying a single option `"No matches available"`.
3. **Component Styling**:
   - Apply CSS Modules class names `.container`, `.label`, and `.select`.
   - Connect to custom Obsidian design tokens: `--card-bg`, `--card-border`, `--text`, `--text-h`, `--accent-cyan`, `--focus-glow`, `--bg-obsidian-end`.
   - Apply a smooth `transition` on hover/focus states.
   - Use `max-width`, `text-overflow: ellipsis`, `white-space: nowrap`, and `overflow: hidden` on the select element to protect against layout breakage on mobile/narrow viewports.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.tsx` | Create | Confirmed | Task File | Component logic |
| `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.module.css` | Create | Confirmed | Task File | Style sheet |

## Implementation Steps

1. **Create Directory**:
   - Ensure the directory `src/main/frontend/src/features/dashboard/presentation/components/` is present.
2. **Implement Component**:
   - Create `MatchRangeFilter.tsx` in that directory.
   - Import `React` and the `useDashboard` hook from `../context/DashboardContext`.
   - Import the styles module `styles` from `./MatchRangeFilter.module.css`.
   - Set up the functional component skeleton.
   - Extract context variables. Guard `rawData` to ensure it falls back to an empty array if not defined.
   - Return JSX containing:
     - A wrapping `div` styled with `styles.container`.
     - A `<label>` pointing to `match-range-select` styled with `styles.label`.
     - A `<select>` element with `id="match-range-select"`, `value={activeRange}`, `onChange={...}` handler, disabled when `totalMatches === 0`, and styled with `styles.select`.
     - Options rendered dynamically using option values `20`, `50`, and `100` with the specified dynamic text formatting.
3. **Implement Styles**:
   - Create `MatchRangeFilter.module.css` in the same directory.
   - Structure container layout using `inline-flex` and a `gap` of 8px.
   - Style the label with small text weight and gray color.
   - Style the select element:
     - Use `var(--card-bg)` for background, `var(--card-border)` for border.
     - Add `transition: border-color 0.2s ease, box-shadow 0.2s ease`.
     - Apply hover and focus classes. Use `var(--accent-cyan)` for border color and `var(--focus-glow)` for box shadow on focus/hover.
     - Add `max-width: 220px`, `text-overflow: ellipsis`, `white-space: nowrap`, and `overflow: hidden` to defend layout displacement.
     - Style options with `background: var(--bg-obsidian-end)` and `color: var(--text-h)`.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `MatchRangeFilter` component renders a select element or styled button group with options 20, 50, and 100. | Full | Component renders select element with option values 20, 50, 100. Checked via TypeScript compiling. |
| Option labels dynamically adjust to show available count when the player's total match list length is less than the option. | Full | Implemented conditional label string interpolation. Checked via TypeScript compiling. |
| Dropdown options remain clickable and successfully trigger context updates. | Full | Value bind to `activeRange` and onChange triggers `setActiveRange`. Checked via TypeScript compiling. |
| CSS module styles are applied correctly with class names isolated to the component. | Full | Scoped CSS Module imported and mapped to classNames. Checked via TypeScript compiling. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| TypeScript Compiler Check | Compilation | Ensure no syntax, import, or typing errors. | Run `npx tsc --noEmit` in `src/main/frontend` |
| CSS Modules Validation | Compilation | Ensure CSS is correctly bound and imported. | Verified during frontend build check |

## Dependencies

- `002-implement-context-state-and-slicing.md` (Already Implemented)

## Risks and Edge Cases

- **Risk**: Option text length overflows the container.
  - *Mitigation*: CSS rules `max-width: 220px`, `overflow: hidden`, `text-overflow: ellipsis` are applied to the select element.
- **Risk**: `rawData` context property is undefined or null on initial loading.
  - *Mitigation*: Code falls back to `[]` when fetching `rawData.length` and disables the select dropdown.

## Rollback or Recovery Notes

- Since this task only creates new files, rollback can be easily executed by deleting:
  - `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.tsx`
  - `src/main/frontend/src/features/dashboard/presentation/components/MatchRangeFilter.module.css`

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

## Task Planning Readiness Checklist

- [x] Task file reviewed.
- [x] Feature context reviewed.
- [x] Feature Tech Spec coverage verified.
- [x] Technology decisions reviewed.
- [x] Applicable guidelines reviewed.
- [x] Existing decisions reviewed.
- [x] Local codebase references checked when applicable.
- [x] Task dependencies checked.
- [x] Execution eligibility documented.
- [x] Blocking decisions resolved.
- [x] Local feature/task decisions documented when needed.
- [x] Architecture/global decisions routed to ADR or `resolve-architecture-blocker` when needed.
- [x] Implementation approach defined.
- [x] Acceptance criteria mapped.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

- Be sure to verify that `DashboardContext.tsx` is correctly imported.
- The component must fall back to an empty array for `rawData` to prevent runtime crashes.
- Do not mount the component onto the main page or modify any widgets. Only create the files defined in this scope.
