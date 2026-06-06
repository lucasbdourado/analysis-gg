# Task Implementation Plan: Implement Context State and Slicing

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/match-range-filter/task-plans/002-implement-context-state-and-slicing-plan.md`

## Task Reference

Task ID: `002`

Task file: `docs/features/match-range-filter/tasks/002-implement-context-state-and-slicing.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `match-range-filter`

Feature file: `docs/features/match-range-filter/feature.md`

Feature Tech Spec: `docs/features/match-range-filter/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/match-range-filter/tasks/002-implement-context-state-and-slicing.md` | Scope, Acceptance Criteria | Confirmed by source document | Defines goals and limits |
| Feature file | `docs/features/match-range-filter/feature.md` | Feature Goal, Scope | Confirmed by source document | Contextual business rules |
| Feature Tech Spec | `docs/features/match-range-filter/tech-spec.md` | Proposed Technical Approach, Slicing Logic | Confirmed by source document | Exact slicing algorithm |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | React Context API stack choice |
| Decision 001 | `docs/features/match-range-filter/decisions/001-match-summary-location.md` | Entire document | Confirmed by source document | MatchSummary import path |
| Task 001 Execution Report | `docs/features/match-range-filter/executions/001-setup-dashboard-context-and-scaffolding-execution.md` | Implemented Changes | Confirmed by source document | Existing context skeleton |

## Planning Scope

This plan covers the React Context state management, client-side slicing logic, and custom consumer hook `useDashboard`. It does not cover the dropdown component rendering, styling, dashboard layout integration, or unit tests creation.

## Task Summary

Implement `DashboardProvider` and custom hook `useDashboard` in `DashboardContext.tsx` with safe slicing calculations based on the selected range.

## Execution Eligibility

Status: Eligible

Reason:

- The dependency task `001-setup-dashboard-context-and-scaffolding.md` has been successfully implemented and verified.

## Feature Context

To allow multiple dashboard widgets (weekday win rate, daily grid, champion table) to display synchronized data based on a selected game count (20, 50, or 100), we must centralize the active range filter state and sliced data in a React Context.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Proposed Technical Approach | Full | Yes | Implements folder layout structure & context flow |
| Context & State Management | Full | Yes | Implements state variables & useMemo slicing |

Coverage assessment:

- Justifying Tech Spec section: `Proposed Technical Approach` and `Context & State Management`
- Tech Spec sections implemented by this task: `Context & State Management`
- Gaps between task and Tech Spec: None
- Dependencies not specified by the Tech Spec: None

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Safe type declarations for props and state |
| Context API & useState | `technology-definition.md` | Use React `useState` and `useMemo` hooks |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| State Management | `.agents/docs/architecture/react-coding-guidelines/state-management.md` | React Context | Guidance on using `useMemo` for derived states to avoid redundant computations |
| Hooks | `.agents/docs/architecture/react-coding-guidelines/hooks-guidelines.md` | Custom hooks | Setup standard prefix `use`, check context definition validity, and throw errors if consumed outside a provider |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Task Decision: Match Summary Interface Location | `docs/features/match-range-filter/decisions/001-match-summary-location.md` | Confirmed we import `MatchSummary` from `../../domain/MatchSummary` |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` | Inspected current skeleton | Baseline for code modification | Created in Task 001 |
| `src/main/frontend/src/features/dashboard/domain/MatchSummary.ts` | Inspected interface | Source type for `rawData` and `filteredMatches` | Created in Task 001 |

## Confirmed Scope

- Import necessary hooks (`useState`, `useMemo`, `useContext`) and types (`ReactNode`, `FC`) from `'react'`.
- Implement and export `DashboardProviderProps` interface accepting optional `rawData` and `children`.
- Implement and export `DashboardProvider` component.
  - Initialize `activeRange` state to `20`.
  - Safely compute `filteredMatches` using `useMemo` and dependencies `[rawData, activeRange]`.
  - Fallback to empty array if `rawData` is null or undefined.
  - Implement slicing: `rawData.slice(0, Math.min(rawData.length, activeRange))`.
- Implement and export `useDashboard` custom hook:
  - Throw standard error if Context is undefined (consumed outside of `DashboardProvider`).

## Out of Scope

- Creating the selector dropdown component (`MatchRangeFilter.tsx`) or its styles.
- Integrating `DashboardProvider` in the layout or page.
- Modifying widgets.
- Writing Vitest unit tests (deferred to Task 006).

## Proposed Implementation Approach

1. Import required React constructs.
2. Declare provider interface and component.
3. Write context state and safe client-side slice computations inside `useMemo`.
4. Define hook checks.
5. Verify syntax and types via compilation verification command.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` | Modify | Confirmed | Task Scope | Main context file |

## Implementation Steps

1. Open `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`.
2. Update React imports to include `useState`, `useMemo`, `useContext`, and `ReactNode`.
3. Add `DashboardProviderProps` interface:
   ```typescript
   export interface DashboardProviderProps {
     rawData?: MatchSummary[];
     children: ReactNode;
   }
   ```
4. Define and export `DashboardProvider` component:
   ```typescript
   export const DashboardProvider: React.FC<DashboardProviderProps> = ({ rawData = [], children }) => {
     const [activeRange, setActiveRange] = useState<number>(20);

     const filteredMatches = useMemo(() => {
       const data = rawData || [];
       return data.slice(0, Math.min(data.length, activeRange));
     }, [rawData, activeRange]);

     return (
       <DashboardContext.Provider value={{ rawData: rawData || [], activeRange, setActiveRange, filteredMatches }}>
         {children}
       </DashboardContext.Provider>
     );
   };
   ```
5. Define and export custom hook `useDashboard`:
   ```typescript
   export const useDashboard = (): DashboardContextProps => {
     const context = useContext(DashboardContext);
     if (context === undefined) {
       throw new Error('useDashboard must be used within a DashboardProvider');
     }
     return context;
   };
   ```
6. Verify code changes compile cleanly without errors by running frontend type checks.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| `DashboardProvider` manages `activeRange` and updates correctly | Covered by `useState` hook state integration in `DashboardProvider` | Compiles successfully; tested in later integration/unit tests |
| `filteredMatches` derived array matches sliced count | Covered by `useMemo` slicing formula implementation | Compiles successfully; tested in later integration/unit tests |
| `useDashboard` hook throws errors outside provider | Covered by checking if context is undefined and throwing expected Error | Compiles successfully; tested in later integration/unit tests |
| Edge cases (empty arrays, undefined values) handled gracefully | Covered by default empty array prop and fallback arrays in `useMemo` | Compiles successfully; tested in later integration/unit tests |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| TypeScript check | Compile | Verify correct types and imports | Run `npx tsc --noEmit` inside `src/main/frontend` |

## Dependencies

- Must be executed after Task 001 is implemented (Complete).
- Required for Task 003 (Create Range Filter Component) to begin.

## Risks and Edge Cases

- **Null/Undefined `rawData` propagation**: Addressed by fallback assignments `rawData = []` and `rawData || []` to ensure `.slice()` or `.length` operations never crash.
- **Incorrect hook consumption error message**: Ensured hook prints highly descriptive error message.

## Rollback or Recovery Notes

- If execution fails or needs to be undone, run `git checkout src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx` to restore to task 001 skeleton state.

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

- Always treat the task plan as the execution contract.
- Keep scope confined solely to context provider, slicing, hook implementation. Do not edit page components or styles.
- Ensure TypeScript verification is run and passes successfully inside `src/main/frontend`.
