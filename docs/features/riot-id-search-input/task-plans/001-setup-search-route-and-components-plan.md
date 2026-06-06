# Task Implementation Plan: Setup Search Route and Component Scaffolding

## Status

Status: Ready for Implementation

Last updated: 2026-06-05

Plan file: `docs/features/riot-id-search-input/task-plans/001-setup-search-route-and-components-plan.md`

## Task Reference

Task ID: `001-setup-search-route-and-components`

Task file: `docs/features/riot-id-search-input/tasks/001-setup-search-route-and-components.md`

Task status: `Ready`

## Feature Reference

Feature name: `riot-id-search-input`

Feature file: `docs/features/riot-id-search-input/feature.md`

Feature Tech Spec: `docs/features/riot-id-search-input/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-id-search-input/tasks/001-setup-search-route-and-components.md` | Goal, Scope, Out of Scope | Confirmed by source document | Primary task definition |
| Feature file | `docs/features/riot-id-search-input/feature.md` | Feature Goal, Scope | Confirmed by source document | Functional context |
| Feature Tech Spec | `docs/features/riot-id-search-input/tech-spec.md` | Proposed Technical Approach, Folder Layout | Confirmed by source document | Architectural blueprint |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Binding stack and constraints |

## Planning Scope

This plan covers the initialization of the React/Vite + TS application in `src/main/frontend`, setting up the base folders layout, configuring the routing using React Router, and scaffolding the visual and layout components for the Riot ID Search Input feature.

## Task Summary

Initialize the React client workspace in `src/main/frontend` using Vite React + TS. Configure routing in `src/app/routes.tsx` mapping `/` to `SearchLandingPage` and `/dashboard` to a placeholder `DashboardPage`. Scaffold core folders and files for presentation and shared UI components according to Clean Architecture layout.

## Execution Eligibility

Status: Eligible

Reason:
- This is the first sequential task of the feature and has no pending prior dependencies.
- Greenfield project initialization is now incorporated into the task steps.

## Feature Context

The `riot-id-search-input` feature is the primary landing page and onboarding flow for Analysis.GG. It serves as the entry point where the user inputs their Riot ID and selects their region. This task establishes the component skeletons and routing backbone before adding style, validation logic, and redirect capabilities.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| 1. Routing and Page Composition | Partial | Scaffolds `src/app/routes.tsx` mapping `/` and `/dashboard` | Style/design tokens are out of scope. |
| 10. Architecture Notes | Full | Follows Clean Architecture layer layout and folder hierarchy | Scaffolds files according to layout. |

Coverage assessment:
- **Justifying Tech Spec section**: Routing and Page Composition & Architecture Notes.
- **Tech Spec sections implemented by this task**: Folders layout and basic routes mapping.
- **Gaps between task and Tech Spec**: Styling guidelines, CSS modules styling, validation logic, and unit tests are out of scope for this scaffolding task.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Components will be written in `.tsx` format using TypeScript interfaces. |
| React Router (`react-router-dom`) | `technology-definition.md` | Routing mapped in `src/app/routes.tsx` using standard routing hooks/components. |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Scaffolds matching empty `*.module.css` files alongside React components. |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Coding Guidelines | `.agents/docs/architecture/react-coding-guidelines/README.md` | Project structure & routing | Standardizes file locations. |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Scaffolding component structure | Scaffolds visual components as stateless, presentational components receiving simple props. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Standard project layout | `docs/context/project-structure.md` | Defines `src/main/frontend` as the React root. |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `c:\Users\lucas.dourado\IdeaProjects\analysis-gg` | Workspace root structure | Checks existence of React code | No `src/main/frontend` or React files exist yet. This is a Greenfield project. |

## Confirmed Scope

- Create directory `src/main/frontend` and initialize a Vite React + TypeScript template.
- Configure `tsconfig.json` and basic project settings.
- Install `react-router-dom` and testing framework dependencies (`vitest`, `@testing-library/react`, etc. for future tasks).
- Configure routing in `src/app/routes.tsx` mapping `/` to `SearchLandingPage` and `/dashboard` to `DashboardPage` (placeholder).
- Scaffold page component `SearchLandingPage.tsx` under `src/features/search/presentation/pages/`.
- Scaffold form component `SearchForm.tsx` under `src/features/search/presentation/components/`.
- Scaffold shared components:
  - `src/shared/ui/Input/Input.tsx`
  - `src/shared/ui/Select/Select.tsx`
  - `src/shared/ui/Button/Button.tsx`
- Scaffold matching empty CSS modules (`SearchForm.module.css`, `Input.module.css`, `Select.module.css`, `Button.module.css`).

## Out of Scope

- Implementing actual CSS visual rules (styles, animations, layouts).
- Form validation hooks (`useState`, regex checks).
- Redirection parameters handling and submission logic.
- Unit tests.

## Proposed Implementation Approach

1. Initialize Vite application under `src/main/frontend`.
2. Configure basic file structures in the frontend workspace.
3. Configure React Router in `src/app/routes.tsx` using standard react-router configuration (`createBrowserRouter` or JSX-based routes).
4. Create bare functional component skeletons with basic TS definitions and props types.
5. Import components into the routing file and verify successful compile.

## Expected Files or Areas

All paths are relative to `src/main/frontend`:

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/` files (package.json, tsconfig, vite.config.ts) | Create | Confirmed | Tech Spec | Base React/Vite structures |
| `src/app/routes.tsx` | Create | Confirmed | Tech Spec | Route configuration |
| `src/features/search/presentation/pages/SearchLandingPage.tsx` | Create | Confirmed | Tech Spec | Page wrapper component |
| `src/features/search/presentation/components/SearchForm.tsx` | Create | Confirmed | Tech Spec | Inner form component |
| `src/features/search/presentation/components/SearchForm.module.css` | Create | Confirmed | Tech Spec | Empty CSS modules |
| `src/shared/ui/Input/Input.tsx` | Create | Confirmed | Tech Spec | Shared textbox skeleton |
| `src/shared/ui/Input/Input.module.css` | Create | Confirmed | Tech Spec | Empty CSS modules |
| `src/shared/ui/Select/Select.tsx` | Create | Confirmed | Tech Spec | Shared selector skeleton |
| `src/shared/ui/Select/Select.module.css` | Create | Confirmed | Tech Spec | Empty CSS modules |
| `src/shared/ui/Button/Button.tsx` | Create | Confirmed | Tech Spec | Shared button skeleton |
| `src/shared/ui/Button/Button.module.css` | Create | Confirmed | Tech Spec | Empty CSS modules |

## Implementation Steps

1. Create directory `src/main/frontend` if it does not exist.
2. Initialize the Vite React + TS project inside `src/main/frontend/` using `npx -y create-vite@latest . --template react-ts` inside that directory.
3. Run `npm install` and install routing library: `npm install react-router-dom`.
4. Install dev dependencies for upcoming tests: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`.
5. Configure the base folders under `src/main/frontend/src/`:
   - `src/app/`
   - `src/features/search/presentation/pages/`
   - `src/features/search/presentation/components/`
   - `src/shared/ui/Input/`
   - `src/shared/ui/Select/`
   - `src/shared/ui/Button/`
6. Create routing file `src/app/routes.tsx` setting up routes mapping `/` -> `SearchLandingPage` and `/dashboard` -> placeholder `DashboardPage`.
7. Scaffold the page, form, and shared UI files with functional component skeletons:
   - Make components export simple props types or blank layouts.
   - For page `SearchLandingPage.tsx`, render the nested `SearchForm`.
   - For form `SearchForm.tsx`, render scaffolded `Input`, `Select`, and `Button` inside a standard `<form>`.
8. Create empty CSS modules files:
   - `src/features/search/presentation/components/SearchForm.module.css`
   - `src/shared/ui/Input/Input.module.css`
   - `src/shared/ui/Select/Select.module.css`
   - `src/shared/ui/Button/Button.module.css`
9. Update `src/main.tsx` and `src/App.tsx` (or `src/app/App.tsx`) to integrate and render the Router provider configuration.
10. Verify compile and run build check (`npm run build`) in `src/main/frontend/` to confirm that there are no TS, JSX or file import issues.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| React application router has `/` mapping to `SearchLandingPage`. | Routing mapping in `src/app/routes.tsx`. | Inspection of routing configuration. |
| Application compiles successfully with new component skeletons. | Component imports and exports match. | Run compilation check during execution. |
| Scaffolding folders and files match the Clean Architecture layout. | Folders matching Tech Spec structure. | Directory layout mapping. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| File existence & paths | Manual | Confirm structure matches Clean Architecture layout | Verifies matching folder structure |
| Build verification | Build command | Confirm application compiles | Verify no typescript/import syntax errors |

## Dependencies

- **Codebase baseline**: This task establishes the baseline.

## Risks and Edge Cases

- Path routing mismatch if files are placed in incorrect folders relative to main app entry.
- Broken router imports if React Router dependencies are missing in the workspace.

## Rollback or Recovery Notes

- If files are placed incorrectly, they can be safely deleted or moved. Since this is the initial setup, there is no legacy code regression risk.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

`No local feature/task decisions were created during this planning session.`

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

- Ensure that Vite is initialized in non-interactive mode.
- Set up proxy settings in `vite.config.ts` matching backend port/host configurations.
- Use explicit component skeletons with TypeScript props defined so compilation is fully verified.
