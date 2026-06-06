# Task Implementation Plan: Add Weekday Win Rate Chart Tests

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/weekday-win-rate-bar-chart/task-plans/002-add-weekday-win-rate-chart-tests-plan.md`

## Task Reference

Task ID: `002-add-weekday-win-rate-chart-tests`

Task file: `docs/features/weekday-win-rate-bar-chart/tasks/002-add-weekday-win-rate-chart-tests.md`

Task status: `Depends on Previous Task` (Dependency `001-align-sequential-day-ordering.md` is already Implemented)

## Feature Reference

Feature name: `weekday-win-rate-bar-chart`

Feature file: `docs/features/weekday-win-rate-bar-chart/feature.md`

Feature Tech Spec: `docs/features/weekday-win-rate-bar-chart/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/weekday-win-rate-bar-chart/tasks/002-add-weekday-win-rate-chart-tests.md` | Whole document | Confirmed by source document | Primary task definition |
| Feature file | `docs/features/weekday-win-rate-bar-chart/feature.md` | Whole document | Confirmed by source document | Functional context |
| Feature Tech Spec | `docs/features/weekday-win-rate-bar-chart/tech-spec.md` | Testing Strategy | Confirmed by source document | Recharts mocking strategy |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Vite, Vitest, React, CSS Modules |
| Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Component tests | Confirmed by source document | React testing best practices |

## Planning Scope

This planning session covers the creation of unit and component tests for `WeekdayWinRateChart.tsx` under the path `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx`. It does not authorize editing code or starting implementation.

## Task Summary

Create a comprehensive Vitest testing suite verifying empty states, weekday data aggregation, Monday-to-Sunday sorting, win rate rounding calculations, and custom tooltip content formatting.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `001-align-sequential-day-ordering.md`, which is already marked as `Implemented`. Therefore, this task is eligible to be executed.

## Feature Context

The Weekday Win Rate Bar Chart parses matches and groups them client-side by day of the week, displaying them Monday to Sunday. Adding tests ensures the correctness of this grouping, ordering, and the UI components under various match data scenarios.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Testing Strategy | Full | Yes | Implements the detailed component and unit testing strategies including Recharts mocking. |

Coverage assessment:
- Justifying Tech Spec section: `Testing Strategy`
- Tech Spec sections implemented by this task: `Testing Strategy`
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | React Testing Library and TypeScript typing in tests |
| Recharts | `technology-definition.md` | Requires layout and SVG mocking due to lack of `ResizeObserver` in JSDOM |
| Vitest | `technology-definition.md` | Run test suites, configure mock functions, and assert expectations |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React Testing Guidelines | `.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md` | Component & Unit tests | Prioritize checking behavior (data rendering, empty states) over internal state. |

## Existing Decisions Reviewed

No existing feature, ADR, or architecture decision was relevant to this task.

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx` | Main chart component | Understands exact DOM elements, empty state class/text, and custom tooltip triggers. | Component under test |
| `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.test.tsx` | Dashboard Context test file | Provides helper function `createMockMatches` and `DashboardProvider` wrap structure. | Reference for match data mocks |

## Confirmed Scope

- Mock Recharts components dynamically so that we can verify both the data passed to `BarChart` and the customized `Tooltip` rendering.
- Write a timezone-independent local match generator helper to avoid test failures in different runner environments.
- Verify the empty state string ("No match records to display.") is rendered when no matches are provided.
- Verify day grouping matches correctly (Monday through Sunday) and includes wins/losses count.
- Verify rounding logic (e.g. 1 win, 2 losses = 33%).
- Verify CustomTooltip render output when active vs inactive or empty.

## Out of Scope

- E2E browser tests using Playwright.
- Styling checks or CSS module layout validation.
- Integration tests of the dashboard pages or Riot API endpoints.

## Proposed Implementation Approach

1. **Recharts Mocking**: Mock the `recharts` package in the test file. A dynamic mutable mock config for the `Tooltip` will allow changing its props (active, payload, label) to test the customized tooltip component's output directly:
   ```typescript
   let mockTooltipProps = {
     active: false,
     payload: [] as any[],
     label: '',
   };

   vi.mock('recharts', async () => {
     const React = await import('react');
     return {
       ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
       BarChart: ({ children, data }: any) => (
         <div data-testid="bar-chart" data-data={JSON.stringify(data)}>
           {children}
         </div>
       ),
       XAxis: () => <div />,
       YAxis: () => <div />,
       Tooltip: ({ content }: any) => {
         if (React.isValidElement(content)) {
           return React.cloneElement(content, mockTooltipProps as any);
         }
         return null;
       },
       CartesianGrid: () => <div />,
       Bar: () => <div />,
     };
   });
   ```
2. **Timezone Mitigation**: Build a helper to generate match creation timestamps based on a local date offset. By aligning dates dynamically using `new Date()`, we ensure `.getDay()` matches exactly what we expect on any system:
   ```typescript
   const createLocalMatch = (dayOfWeek: number, win: boolean): MatchSummary => {
     const date = new Date();
     const currentDay = date.getDay(); // 0 (Sunday) to 6 (Saturday)
     const diff = dayOfWeek - currentDay;
     date.setDate(date.getDate() + diff);
     
     return {
       matchId: `match-${dayOfWeek}-${Math.random()}`,
       gameDuration: 1200,
       gameCreation: date.getTime(),
       queueId: 420,
       win,
       championId: 1,
       championName: 'Champion',
       kills: 5,
       deaths: 3,
       assists: 10,
       totalMinionsKilled: 150,
       neutralMinionsKilled: 20,
     };
   };
   ```

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx` | Create | Confirmed | Task File | Primary target of the task |

## Implementation Steps

1. Create `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx`.
2. Configure the mocked `recharts` module with the dynamic tooltip proxy.
3. Import the required testing utilities (`render`, `screen`, `describe`, `it`, `expect`, `vi`, `beforeEach`).
4. Write a test case verifying the empty state card text when the match array is empty.
5. Write a test case for correct weekday grouping and Monday-to-Sunday sorting. Use the local date helper to build a test match dataset, render the component, parse the data attribute on `bar-chart`, and verify that:
   - Length of data array is exactly 7.
   - Day names order is Monday, Tuesday, ..., Sunday.
   - Sums of wins/losses map accurately.
6. Write a test case for win-rate rounding calculations (specifically fractions like 33.33% resolving to 33%, etc.).
7. Write tooltip assertions:
   - When inactive: tooltip returns null.
   - When active with a normal match record: checks format `Win Rate: X% (YW - ZL)` and correct label.
   - When active with 0 games: checks format `No games played`.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| All test cases run and pass under `npm run test` or `vitest` | Checked by executing vitest in execution task | Test output log showing 100% green |
| Empty state text verification ("No match records to display.") | Test case checking empty raw data | Assertion checking `screen.getByText` |
| Monday-first and Sunday-last sorting verification | Test case parsing Recharts bar chart payload | Assertion validating sequential array output order |
| Rounding logic correctness | Test case passing 1 win and 2 losses (33%) | Assertion validating aggregated `winRate` prop |
| Hover tooltip content matches spec / no games played | Test cases manipulating `mockTooltipProps` | Assertions validating UI content text |
| No SVG / ResizeObserver / layout errors thrown | Mocked recharts container and elements | Zero errors in test output |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Component and Unit Tests | Vitest | Ensure the correct aggregation, sorting, rounding and rendering | Run via `npx vitest run src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx` |

## Dependencies

- Task `001-align-sequential-day-ordering.md` (Already Implemented).

## Risks and Edge Cases

- **Timezone Drift**: Running test in different timezones could shift static UTC timestamps to another day. Resolved by setting timestamps dynamically relative to local `new Date()`.
- **Recharts Mock Rigidity**: If Recharts updates its API, the mock might require adaptations. Keep the mock simple.

## Rollback or Recovery Notes

- To rollback, simply delete the new test file `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx`.

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

- Implement the timezone-independent match creator to prevent CI/CD environment failures.
- Implement the dynamic `mockTooltipProps` proxy for `Tooltip` mock to easily test custom tooltip content in detail.
