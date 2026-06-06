# Feature Technical Specification: Weekday Win Rate Bar Chart

## Status

Status: Confirmed
Last updated: 2026-06-06
Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Feature Reference

`docs/features/weekday-win-rate-bar-chart/feature.md`

Target output path: `docs/features/weekday-win-rate-bar-chart/tech-spec.md`

## Source Documents

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Feature | [feature.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/features/weekday-win-rate-bar-chart/feature.md) | Feature | Confirmed | Primary feature source |
| Project Planning | [project-planning.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/planning/analysis-gg/project-planning.md) | Planning | Confirmed | MVP context, phases, dependencies |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Technology definition | Confirmed | Confirmed stack and constraints |

## Specification Scope

This technical specification covers client-side data parsing, weekday aggregation formulas, timezone conversion strategy, UI rendering using Recharts, responsive layouts using CSS modules, and unit testing guidelines for the **Weekday Win Rate Bar Chart** widget.

## Feature Summary

The Weekday Win Rate Bar Chart calculates and visualizes a player's win rate percentage grouped by the day of the week. The data is sliced dynamically by the active match range filter and calculated client-side. The chart is rendered sequentially from Monday to Sunday. Hovering over each bar displays a tooltip detailing the win rate alongside the exact win-loss count (e.g. `Win Rate: 60% (3W - 2L)`).

## Feature Goal

Present a bar chart visualization showing a player's ranked win rate percentage grouped by day of the week (Monday through Sunday) to highlight behavioral performance trends.

## Product Completion Criteria

- [ ] Day extraction from UTC game timestamps (converting to user timezone using standard browser APIs).
- [ ] Rounding formula: `WinRate = Math.round((Wins / Total) * 100)`. If total is 0, it defaults to 0.
- [ ] Sequence starting at Monday and ending on Sunday (Mon-Sun).
- [ ] Hover tooltip displays `Win Rate: X% (YW - ZL)` or `No games played` if no games occurred on that day.
- [ ] Renders an empty state gracefully when the overall match list is empty.

## Technical Goals

- Aggregations are calculated dynamically in a `useMemo` block using `filteredMatches` from `DashboardContext`.
- Convert unix epoch milliseconds (`gameCreation`) to local weekday name using standard JavaScript Date methods.
- Align the sequential ordering of the data to ensure Recharts displays Monday through Sunday (since JavaScript's `date.getDay()` starts with Sunday at index 0).
- Mock Recharts components in Vitest tests to verify calculations and component states without layout/rendering errors.

## Non-Goals

- Aggregation in backend endpoints (all aggregation is performed client-side).
- Filtering by queue type or timezone selections in the chart itself (governed globally).
- Persisting chart state on refresh.

## Confirmed Technology Decisions

| Area | Decision | Source | Applies To | Notes |
| --- | --- | --- | --- | --- |
| **Frontend Framework** | React (Vite + TS) | `technology-definition.md` | Whole frontend | Type-safe components |
| **State Management** | React Context API | `technology-definition.md` | Dashboard state | Shared context provider `useDashboard` |
| **Charting** | Recharts | `technology-definition.md` | Weekday chart | ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis, CartesianGrid |
| **Styling** | Vanilla CSS (CSS Modules) | `technology-definition.md` | WeekdayWinRateChart component | CSS classes scoped to module |
| **Performance** | React `useMemo` | `technology-definition.md` | Component calculations | Memoized calculations |

## Pending Technology Decisions

| Area | Pending Decision | Impact on Feature | Required Next Step |
| --- | --- | --- | --- |
| None | None | None | None |

## Applicable Guidelines and References

| Reference | Path | Applies To | Usage |
| --- | --- | --- | --- |
| React Coding Guidelines | [.agents/docs/architecture/react-coding-guidelines/](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/react-coding-guidelines/) | Component structure | Project-wide frontend layout |
| State Management | [.agents/docs/architecture/react-coding-guidelines/state-management.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/react-coding-guidelines/state-management.md) | State strategy | Local & context separation |
| Styling Guidelines | [.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/react-coding-guidelines/styling-guidelines.md) | CSS design | CSS modules & tokens |
| Testing Guidelines | [.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/.agents/docs/architecture/react-coding-guidelines/testing-guidelines.md) | Component tests | Vitest and Testing Library |

## Proposed Technical Approach

### Folder Layout
```txt
src/features/dashboard/
  presentation/
    components/
      WeekdayWinRateChart.tsx        # UI and aggregation calculations
      WeekdayWinRateChart.module.css # Component styles
```

### Data Flow & Timezone Conversion
1. `filteredMatches` are fetched from `useDashboard()` context.
2. For each match, parse `match.gameCreation` (timestamp in ms) into a Date object:
   ```typescript
   const date = new Date(match.gameCreation);
   ```
   This automatically uses the client's local timezone.
3. Extract day of the week index using `date.getDay()`. Note the standard mapping:
   - `0`: Sunday
   - `1`: Monday
   - `2`: Tuesday
   - `3`: Wednesday
   - `4`: Thursday
   - `5`: Friday
   - `6`: Saturday
4. Accumulate wins and losses into an intermediate array or object.
5. Order the final chart data array from Monday (index 1) to Sunday (index 0) to ensure the bar chart displays Monday through Sunday sequentially:
   ```typescript
   // Map Sunday (0) to end of week, or slice and rotate the Sunday value
   const sequentialDays = [...days.slice(1), days[0]];
   ```

## Modules and Responsibilities

| Module or Component | Responsibility | Inputs | Outputs | Notes |
| --- | --- | --- | --- | --- |
| `WeekdayWinRateChart` | Main container component. Extracts context, calculates weekday performance, and returns the Recharts component. | Context values (`filteredMatches`) | JSX wrapper card and Recharts tree | Handled inside dashboard page |
| `CustomTooltip` | Custom overlay component for hover values. Renders tooltip markup. | Hover state, active payload | JSX Tooltip UI | Nested inside `WeekdayWinRateChart` |

## Integration Contracts

No backend modifications are necessary. The widget consumes the existing `/api/summoner/{gameName}/{tagLine}` matches response.

## Data Model

`Not applicable` — Feature is client-side only.

## Data Contracts

### Match Summary Structure (`MatchSummary.ts`)
```typescript
export interface MatchSummary {
  matchId: string;
  gameDuration: number;
  gameCreation: number;
  queueId: number;
  win: boolean;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
}
```

### Chart Data Point structure (`ChartData`)
```typescript
interface ChartData {
  dayName: string;
  winRate: number;
  wins: number;
  losses: number;
}
```

## API or Interface Design

Component exposes a standard React functional component interface:
```typescript
export const WeekdayWinRateChart: React.FC = () => { ... }
```

## State and Error Handling

| State or Error | Trigger | Expected Behavior | User/System Feedback | Notes |
| --- | --- | --- | --- | --- |
| **Empty State** | `filteredMatches.length === 0` | Render placeholder message | "No match records to display." displayed inside dashed card | Prevents rendering empty Recharts layouts |
| **No games on specific day** | Total games on day $D$ = 0 | Set `winRate` to 0% | Tooltip displays "No games played" on hover | Handled by custom tooltip |
| **Hover Tooltip** | Hover cursor over a specific day's bar | Show popup element | Display formatted W/L counts and rounded win percentage | Custom Tooltip styling |

## Validation Rules

- Rounded win rate calculation formula:
  $$\text{winRate} = \begin{cases} 0, & \text{if } \text{wins} + \text{losses} = 0 \\ \text{Math.round}\left(\frac{\text{wins}}{\text{wins} + \text{losses}} \times 100\right), & \text{otherwise} \end{cases}$$

## Security and Permissions

`Not applicable` — No authentication or API requests are performed in this component.

## Observability and Logging

- Component performance should be tracked inside React dev tools to ensure the `useMemo` block prevents redundant re-evaluations.

## Performance Considerations

- Wrapping the aggregation logic in `useMemo` using `filteredMatches` as a dependency ensures that re-calculating the 7 weekday metrics happens only when the sliced matches data actually changes.

## Compatibility and Migration Notes

- JavaScript `new Date(timestamp)` and `date.getDay()` handle timezone offsets natively. This is standard in all modern browsers and requires no libraries like `moment.js` or `date-fns` for basic weekday extraction.

## Testing Strategy

All test cases are written using **Vitest** and **React Testing Library**.

| Test Type | What to Validate | Required? | Notes |
| --- | --- | --- | --- |
| Unit | Correct day conversion from UTC timestamp to local day. | Yes | Test using mock timestamps |
| Unit | Correct win rate rounding logic. | Yes | E.g. 1 win, 2 losses = 33% |
| Unit | Sequential ordering (Monday to Sunday). | Yes | Assert days order in aggregated array |
| Component | Renders empty state when no matches exist. | Yes | Assert empty message string exists |
| Component | Custom tooltip renders values correctly. | Yes | Simulate tooltip active payload or mock tooltip rendering |

### Recharts Mocking Strategy in Vitest
Recharts components require responsive sizing elements (`ResizeObserver` and SVG bounds) that are not available in a standard `jsdom` testing environment. We will mock Recharts components globally or locally inside the test file to ensure the tests verify calculations without throwing layout errors:

```typescript
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children, data }: any) => <div data-testid="bar-chart" data-data={JSON.stringify(data)}>{children}</div>,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    CartesianGrid: () => <div />,
    Bar: () => <div />,
  };
});
```

## Risks and Trade-offs

| Risk or Trade-off | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Low sample sizes leading to misleading stats (e.g. 1 game = 100% win rate) | Medium | Medium | Display the exact number of games played (Wins - Losses) in the tooltip for context. | Mitigated |
| User system timezone differences | Low | Low | Uses browser's native timezone calculation, which matches the player's real-life environment. | Accepted |

## Feature Technical Readiness

Status: Ready for Task Breakdown

Reason: The target component `WeekdayWinRateChart.tsx` and styles `WeekdayWinRateChart.module.css` already exist in the codebase. However, we need to:
1. Verify and align the sequential day ordering (ensuring it is Monday-Sunday instead of Sunday-Saturday).
2. Implement robust unit and component tests verifying the aggregation logic, rounding, ordering, and empty states.

## Feature Technical Readiness Checklist

- [x] Feature scope is clear.
- [x] Product completion criteria are understood.
- [x] Technology decisions are confirmed.
- [x] Applicable guidelines and references are listed.
- [x] Integration contracts are marked as not applicable.
- [x] Data model is marked as not applicable.
- [x] Data contracts are defined.
- [x] State and error handling are defined.
- [x] Validation rules are defined.
- [x] Security/permission considerations are marked as not applicable.
- [x] Testing strategy is defined.
- [x] Blocking open questions are resolved.
- [x] Inputs for `create-tasks` are clear.

## Inputs for Create Tasks

- Create task to verify and align the sequential day ordering (Monday to Sunday) in the aggregation logic of `WeekdayWinRateChart.tsx`.
- Create task to add comprehensive unit tests for `WeekdayWinRateChart` under `src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.test.tsx`.
- Create task for verifying feature completion.

## ADR Candidates

| Candidate ADR | Decision Area | Status | Reason |
| --- | --- | --- | --- |
| None | None | None | None |

## Next Recommended Steps

- Run the `create-tasks` workflow to break down this specification into actionable task files under `docs/features/weekday-win-rate-bar-chart/tasks/`.
