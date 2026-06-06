# Task Implementation Plan: Implement Shared UI Components

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-id-search-input/task-plans/002-implement-shared-ui-components-plan.md`

## Task Reference

Task ID: `002`

Task file: `docs/features/riot-id-search-input/tasks/002-implement-shared-ui-components.md`

Task status: `Depends on Previous Task` (eligible now since dependency 001 is Implemented)

## Feature Reference

Feature name: `riot-id-search-input`

Feature file: `docs/features/riot-id-search-input/feature.md`

Feature Tech Spec: `docs/features/riot-id-search-input/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-id-search-input/tasks/002-implement-shared-ui-components.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Primary task scope |
| Feature file | `docs/features/riot-id-search-input/feature.md` | Scope, Feature Completion Criteria | Confirmed by source document | Functional context |
| Feature Tech Spec | `docs/features/riot-id-search-input/tech-spec.md` | UX & UI Styling System, Folder Layout | Confirmed by source document | Styling & layout specs |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | UI Styling, Internal Technology Guidelines | Confirmed by source document | Styling constraints |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS Modules, Tokens de design, Regras | Confirmed by source document | Coding conventions |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Presentational Components | Confirmed by source document | React components conventions |

## Planning Scope

This planning session is strictly limited to Task 002 (Implement Shared UI Components). It covers the styling setup and CSS module declarations for the `Input`, `Select`, and `Button` shared UI components, plus the global design variables definition in `src/index.css`. It does not authorize editing codebase logic outside these files, nor implementing validation, routing redirects, or writing tests.

## Task Summary

Implement visual styling and layout rules for the reusable presentation components (`Input`, `Select`, `Button`) utilizing local CSS modules (`*.module.css`) and global dark obsidian/neon HSL CSS variables inside `src/index.css` to achieve a high-fidelity visual layout.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `001-setup-search-route-and-components.md` which has been fully completed and marked as `Implemented`. Component skeleton files and folders already exist.

## Feature Context

To construct a responsive landing search interface, the application requires modular, consistent visual components. This task implements the foundational visual layer (`Input`, `Select`, `Button`) which will be orchestrated by the parent search form in subsequent tasks.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| UX & UI Styling System | Full | Global variables definition and obsidian/neon/error theme rules | Establishes the HSL design tokens and classes |
| Folder Layout | Full | Styling for components in `src/shared/ui/` folders | Modifies `*.module.css` files |
| Modules and Responsibilities | Partial | Visual states of `Input`, `Select`, and `Button` | Does not implement validation logic, options mapping or click handlers |

Coverage assessment:
- Justifying Tech Spec section: UX & UI Styling System (lines 100-107), Modules and Responsibilities (lines 133-142)
- Tech Spec sections implemented by this task: UX & UI Styling System, Folder Layout (specifically CSS modules styling)
- Gaps between task and Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Styled sheets are kept isolated inside components via local scoping |
| React (Vite + TS) | `technology-definition.md` | Extends React's HTML attributes for input, select, and button elements |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Styling Guidelines | `.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md` | CSS design and modules | Avoid inline styles, use central HSL design tokens, configure CSS modules properly |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Reusable UI components | Keep components presentational, pure, and dependent only on styling states |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Monorepo project structure | `technology-definition.md` | Target files are within the `src/main/frontend` directory |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/shared/ui/` | Directory contents and files | Confirming scaffolded state from Task 001 | Files exist and contain clean, skeleton-like code |
| `src/main/frontend/src/index.css` | Original style declarations | Checking existing global styles | Standard font styles and root tags exist. Need to append design tokens |

## Confirmed Scope

- Define HSL design tokens, import 'Inter' Google Font, and configure base typography in `src/main/frontend/src/index.css`.
- Style `Input` wrapper, text input field, cyan focus glow, error states, and helper error message inside `src/main/frontend/src/shared/ui/Input/Input.module.css`.
- Style `Select` wrapper, select element (using native dropdown arrow per user request), cyan focus glow, error states, and error message inside `src/main/frontend/src/shared/ui/Select/Select.module.css`.
- Style `Button` with neon cyan-to-emerald gradient background, hover glow, active scale transition, and disabled opacity inside `src/main/frontend/src/shared/ui/Button/Button.module.css`.

## Out of Scope

- Implementing client-side Riot ID regex validation rules or hooks.
- Connecting form state to redirect navigation.
- Writing Vitest/RTL unit tests.
- Implementing dashboard components or mock API proxy responses.

## Proposed Implementation Approach

1. **Global Tokens Setup**: Modify `src/main/frontend/src/index.css` to import 'Inter' Google Font. Define the HSL design variables under `:root` and configure base font families.
2. **Input styling**: Modify `src/main/frontend/src/shared/ui/Input/Input.module.css` to provide dark obsidian background, cyan focus outlines, and error red glow visual states.
3. **Select styling**: Modify `src/main/frontend/src/shared/ui/Select/Select.module.css` similarly to keep visual parity, allowing native caret arrow display.
4. **Button styling**: Modify `src/main/frontend/src/shared/ui/Button/Button.module.css` to render the primary gradient background (cyan to emerald), applying glowing drop shadow on hover and click scale-downs.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/index.css` | Modify | Confirmed | Tech Spec (line 101) | Global design variables, font imports |
| `src/main/frontend/src/shared/ui/Input/Input.module.css` | Modify | Confirmed | Tech Spec (line 127) | Local styles for Input |
| `src/main/frontend/src/shared/ui/Select/Select.module.css` | Modify | Confirmed | Tech Spec (line 129) | Local styles for Select |
| `src/main/frontend/src/shared/ui/Button/Button.module.css` | Modify | Confirmed | Tech Spec (line 131) | Local styles for Button |

## Implementation Steps

1. **Setup global HSL tokens**:
   - Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');` at the top of `src/main/frontend/src/index.css`.
   - Add theme variables inside `:root` (e.g. `--bg-obsidian-start`, `--bg-obsidian-end`, `--card-bg`, `--accent-cyan`, `--accent-emerald`, `--accent-gradient`, `--error-red`, `--error-glow`, `--focus-glow`).
   - Configure `--sans` and `--heading` variables to load `Inter`.
2. **Implement Input styles**:
   - Edit `src/main/frontend/src/shared/ui/Input/Input.module.css`.
   - Setup `.wrapper` with `display: flex; flex-direction: column; width: 100%;`.
   - Setup `.input` with dark background, smooth border styling, custom padding, and font variables.
   - Design `.input:focus` with cyan border and glow using `var(--focus-glow)`.
   - Design `.error` with red border and glow using `var(--error-glow)`.
   - Style `.errorText` with red warning color.
3. **Implement Select styles**:
   - Edit `src/main/frontend/src/shared/ui/Select/Select.module.css`.
   - Mirror `.wrapper`, `.select`, and focus/error state designs similar to input. Maintain default browser caret rendering.
4. **Implement Button styles**:
   - Edit `src/main/frontend/src/shared/ui/Button/Button.module.css`.
   - Setup `.button` with background: `var(--accent-gradient)`, bold dark text color, padding, and active/hover transit animations.
   - Configure `:disabled` with cursor not-allowed and lowered opacity.
5. **Compilation Check**:
   - Run compilation command in `src/main/frontend` to verify syntax.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Reusable `Input` supports Controlled Value, focus glows, and error outline borders. | Styled focus states (`var(--focus-glow)`) and error border overlays (`var(--error-glow)`). | Component rendering verification under visual focus and error classes. |
| Reusable `Select` supports populated options and modern dropdown caret styling. | Select border/focus matches input. Native browser arrow display confirmed. | Component rendering dropdown verification. |
| Reusable `Button` supports gradient hovers and disabled opacity states. | Styled background using `var(--accent-gradient)`, hover transitions, active click scales, and disabled opacities. | Interactive hover/press states manual check. |
| Visual look follows the premium dark-mode HSL system (obsidian backdrops, neon overlays). | Colors and shadows driven entirely by global variables declared in `index.css`. | App layout theme verification. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Build Check | Build Verification | Confirm Vite compilation completes without TypeScript or styling warnings | Run `npm run build` locally |
| Theme Manual Inspect | Manual UI inspection | Verify components render with the correct colors, gradients, and hover/glow micro-interactions | Run `npm run dev` and review components visually |

## Dependencies

- Depends on Task `001-setup-search-route-and-components.md` (Already marked `Implemented`).

## Risks and Edge Cases

- **CSS Modules compilation warning**: Ensure proper module syntax and that the path imports inside component files match.
- **Focus styling overrides**: Ensure `:focus-visible` or `:focus` are configured to prevent standard blue focus outline overrides in browsers.

## Rollback or Recovery Notes

- In case of style breakage, discard recent CSS file modifications:
  ```bash
  git checkout -- src/main/frontend/src/index.css src/main/frontend/src/shared/ui/Input/Input.module.css src/main/frontend/src/shared/ui/Select/Select.module.css src/main/frontend/src/shared/ui/Button/Button.module.css
  ```

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Styling Design Decisions | `docs/features/riot-id-search-input/decisions/002-styling-design-decisions.md` | Record user preference on typography, button variants, and select caret |

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

- Focus only on CSS style modifications. Do not change component markup files unless it's to verify CSS classes mapping correctness.
- Ensure the color palette perfectly reflects the obsidian theme: background gradient from `hsl(220, 25%, 5%)` to `hsl(220, 18%, 10%)` and neon accents (`hsl(180, 100%, 50%)` to `hsl(150, 100%, 45%)`).
- Text in button must be a dark, obsidian-like color (e.g. `#08060d`) for high readability over neon gradient buttons.
