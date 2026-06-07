# Task Implementation Plan: Update CSS module styles for sorting indicators, highlights, and portraits

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/top-champions-stats-table/task-plans/004-update-table-styling-plan.md`

## Task Reference

Task ID: `004-update-table-styling`

Task file: `docs/features/top-champions-stats-table/tasks/004-update-table-styling.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `top-champions-stats-table`

Feature file: `docs/features/top-champions-stats-table/feature.md`

Feature Tech Spec: `docs/features/top-champions-stats-table/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/top-champions-stats-table/tasks/004-update-table-styling.md` | Scope, Acceptance Criteria | Confirmed by source document | Defines specific styling requirements |
| Feature file | `docs/features/top-champions-stats-table/feature.md` | Scope, Completion Criteria | Confirmed by source document | Provides functional context |
| Feature Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | Technical Goals, Proposed Technical Approach | Confirmed by source document | Confirms styling requirements and highlights |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | UI Styling | Confirmed by source document | Specifies Vanilla CSS modules |
| React styling guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS Modules, Tokens | Confirmed by source document | Guideline for style tokens and clean CSS |

## Planning Scope

Explain the exact boundary of this planning session. This plan covers one task only and does not authorize implementation.

This plan covers task `004-update-table-styling` only, which involves updating style declarations in `TopChampionsTable.module.css`. It does not authorize editing application React components or other source code files.

## Task Summary

Summarize the single concrete outcome this task must produce.

Add styles to `TopChampionsTable.module.css` to cover sorting indicator arrow layout, pointer cursor headers, champion portraits visual layout, circular fallback placeholder display, win rate highlighting, and row hover transitions.

## Execution Eligibility

Status: Eligible

Reason:
- The task dependency `003-render-champion-portraits-with-fallback.md` is completed and has status `Implemented`.

## Feature Context

Summarize only the feature context needed to understand why this task exists and how it fits the feature.

The Top Champions Stats Table aggregates a player's recent matches per champion and renders performance metrics. Adding interactive styles, clean alignments, and visual indicators makes the table look premium, fits the Obsidian dark theme, and provides clear cues for sorting interaction.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Technical Goals | Full | Yes | Mentions responsive theme consistency, hover states, win rate highlight |
| Proposed Technical Approach | Full | Yes | Defines CSS selectors, highlights, and fallback dimensions |
| Styling & Layout | Full | Yes | Details hover states, win rate highlight, pointer cursors |

Coverage assessment:
- Justifying Tech Spec section: Styling & Layout, Technical Goals.
- Tech Spec sections implemented by this task: Custom styling for interactive headers, sorting indicators, portrait icons, fallback placeholders, and >= 60% win rate highlights.
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Styles must be declared in `TopChampionsTable.module.css` using local CSS class selectors. |
| Theme CSS variables | `index.css` | Use global design variables like `var(--accent-cyan)`, `var(--card-border)`, `var(--text-h)` for visual consistency. |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Component styling guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS Modules | Directs the use of CSS Modules, avoiding inline styling, and using centralized design tokens. |

## Existing Decisions Reviewed

Record documented decisions consulted while preparing the plan.

| Decision | Path | Relevance |
| --- | --- | --- |
| Table design layout | `docs/features/top-champions-stats-table/tech-spec.md` | Outlines the exact columns and cells to style. |

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css` | Existing styles and rules | Target file for styling updates | Needs new style definitions |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Referenced CSS classes in JSX | Matches CSS class names to apply | Identifies unused/unimplemented styling classes |
| `src/main/frontend/src/index.css` | Global styling tokens | Provides HSL variables for theme colours | Used for cyan win rate highlight and border variables |

## Confirmed Scope

List the work confirmed to be part of this task.

- Add interactive hover styles, transition, user-select, and pointer cursors for `th` headers in `.table th` and `.table th:hover`.
- Create `.sortIndicator` styling class for the active sort direction arrow.
- Create `.championInfo` layout class for flex horizontal alignment and gap.
- Create `.championIcon` styling class for rendering images circular and with explicit dimensions (`28px`).
- Create `.championFallback` styling class for rendering the circular fallback placeholder (`28px`, centered text, matching background).
- Ensure `.highWinRate` highlights win rates >= 60% with bold weight and `var(--accent-cyan)`.
- Ensure modern, subtle row transitions on hover for `.tr`.

## Out of Scope

List related work that must not be done in this task.

- React logic changes (already implemented in 001-003).
- Writing component unit test files (handled in 005).

## Proposed Implementation Approach

Describe the future implementation approach using only confirmed information.

1. Inspect the existing `TopChampionsTable.module.css` class declarations.
2. Update the `.table th` rules to include `cursor: pointer`, `user-select: none`, and transition properties.
3. Add `.table th:hover` to apply a subtle background highlight (`rgba(255, 255, 255, 0.04)`).
4. Declare `.sortIndicator` for margins and color styling (`color: var(--accent-cyan)`).
5. Declare `.championInfo` as a flexbox container with `align-items: center` and a gap.
6. Declare `.championIcon` with width and height set to `28px`, `border-radius: 50%`, `object-fit: cover`, and border styling.
7. Declare `.championFallback` with matching dimensions (`28px`), `border-radius: 50%`, background matching the dark theme (`hsl(220, 15%, 20%)`), centered flex layout, high-contrast text (`color: var(--text-h)`), and bold font weight.
8. Declare `.championNameText` for styling the name text color.
9. Ensure `.highWinRate` uses `color: var(--accent-cyan)` and `font-weight: 700`.
10. Ensure row hover has a clean background color transition in `.tr` and `.tr:hover`.

## Expected Files or Areas

List expected files, modules, packages, docs, tests, or areas. Use probable language when exact paths were not confirmed.

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.module.css` | Modify | Confirmed | Task file scope | Main file to be modified |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. **Update Table Headers styling**:
   - Locate `.table th` in `TopChampionsTable.module.css` and add `cursor: pointer`, `user-select: none`, and `transition: background-color 0.15s ease, color 0.15s ease`.
   - Add a hover state `.table th:hover` with `background-color: rgba(255, 255, 255, 0.04)`.
2. **Add Sort Indicator styling**:
   - Append `.sortIndicator` style declaration:
     ```css
     .sortIndicator {
       margin-left: 0.35rem;
       color: var(--accent-cyan);
       font-size: 0.8rem;
       display: inline-block;
       vertical-align: middle;
       line-height: 1;
     }
     ```
3. **Add Champion Portrait and Fallback styling**:
   - Append the following layout and element classes:
     ```css
     .championInfo {
       display: flex;
       align-items: center;
       gap: 0.75rem;
     }

     .championIcon {
       width: 28px;
       height: 28px;
       border-radius: 50%;
       object-fit: cover;
       border: 1px solid var(--card-border);
       display: block;
     }

     .championFallback {
       width: 28px;
       height: 28px;
       border-radius: 50%;
       background-color: hsl(220, 15%, 20%);
       color: var(--text-h);
       display: flex;
       align-items: center;
       justify-content: center;
       font-size: 0.85rem;
       font-weight: 700;
       text-transform: uppercase;
       border: 1px solid var(--card-border);
       box-sizing: border-box;
     }

     .championNameText {
       color: var(--text-h);
     }
     ```
4. **Update Win Rate highlight and row transitions**:
   - Verify `.highWinRate` is defined as:
     ```css
     .highWinRate {
       color: var(--accent-cyan);
       font-weight: 700;
     }
     ```
   - Update `.tr` and `.tr:hover` styles:
     ```css
     .tr {
       border-bottom: 1px solid rgba(255, 255, 255, 0.03);
       transition: background-color 0.2s ease;
     }

     .tr:hover {
       background-color: rgba(255, 255, 255, 0.02);
     }
     ```

## Acceptance Criteria Mapping

Map task acceptance criteria to planned implementation and validation evidence.

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Interactive headers display pointer cursors on hover. | Handled by `.table th { cursor: pointer; }` and `.table th:hover { background-color: rgba(255, 255, 255, 0.04); }` | Visual hover check in browser |
| Sorting indicators (▲/▼) are properly aligned next to the column titles. | Handled by `.sortIndicator` block styles | Visual check of sorting indicator layout |
| Champion portraits render as circles with clean borders. | Handled by `.championIcon` styling with `border-radius: 50%` | Visual check of champion portraits |
| Fallback placeholders display as aligned circle text components when images fail to load. | Handled by `.championFallback` centered flex circle styles | Test by temporarily breaking image URL and checking placeholder rendering |
| Win rates >= 60% are highlighted with the correct HSL cyan variable. | Handled by `.highWinRate` class styles | Visual check of win rate numbers >= 60% |
| CSS changes compile cleanly without errors. | Verification via Vite/Maven build | Clean build execution log |

## Tests and Validation Strategy

Define how the future implementation should be verified.

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Visual Browser Inspection | Manual | Verify styling layout, alignment, color contrast, and hovers in dev server | Check on localhost:5173 |
| Build check | Manual / CLI | Ensure there are no styling errors or compilation breaks | Run `npm run build` in frontend directory |

## Dependencies

List task dependencies, sequencing constraints, external dependencies, and execution eligibility constraints.

- Previous task `003-render-champion-portraits-with-fallback.md` is completed and `Implemented`.
- No other blocking external dependencies.

## Risks and Edge Cases

List known risks, constraints, regression areas, and edge cases.

- **Image alignment on scale differences**: Champion icons from Riot CDN might have variable dimensions. Mitigated by setting explicit dimensions (`width` and `height` as `28px`) and `object-fit: cover`.
- **Text overflow in champion cell**: Champion names with longer strings could push other cells if cell width is constrained. Mitigated by using flex gap layout and padding.

## Rollback or Recovery Notes

Describe rollback, recovery, or safe reversal considerations when relevant.

- Revert styling changes in `TopChampionsTable.module.css` using Git.

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

Add concise handoff notes, source-reading reminders, sequencing constraints, and things the future `execute-task` agent must not assume.

- Implement exactly the style declarations detailed in this plan within `TopChampionsTable.module.css`.
- Ensure class names align perfectly with the ones referenced in `TopChampionsTable.tsx`.
- Test the styles visually.
