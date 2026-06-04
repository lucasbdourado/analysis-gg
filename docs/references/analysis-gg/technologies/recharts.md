# Technology Reference: Recharts

## Status

Status: Captured

Last updated: 2026-06-04

Captured by: Antigravity

## Technology Decision Reference

Related technology definition: [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md)

Decision area: Data Visualization / Charting (Frontend)

Decision status: Confirmed by user

## Why This Technology Was Selected

Recharts is a declarative, composable charting library built with React components and native SVG support:
- Declarative components (e.g., `<BarChart>`, `<Bar>`, `<Tooltip>`) align perfectly with React's modularity.
- Native SVG support allows easy visual customizations using standard CSS/Inline styles.
- Composable `<Tooltip>` component enables custom win rate labels and game count summaries required by MVP-F-004.
- `<ResponsiveContainer>` provides automatic responsiveness across different screen sizes.

## Official Documentation Sources

| Source | URL or Context7 Library ID | Notes |
| --- | --- | --- |
| Context7 | /recharts/recharts | Context7 library ID resolved successfully |
| Storybook | https://github.com/recharts/recharts/tree/main/storybook | Official Storybook configuration |

## Context7 Notes

Recharts uses standard SVG elements under the hood. You can configure responsive scaling by wrapping components in `<ResponsiveContainer>` and customize tooltip behavior with the `content` prop.

## Relevant Concepts for This Project

- **ResponsiveContainer**: Handles resizing of charts dynamically.
- **BarChart / Bar**: Renders vertical/horizontal bars mapping weekdays to win rates.
- **Tooltip**: Displays details (win rate %, wins, losses) on hover.

## Usage Guidelines for This Project

- Wrap the `<BarChart>` inside a `<ResponsiveContainer width="100%" height={300}>`.
- Define a custom tooltip component (`CustomTooltip`) to render detailed win-loss stats like `"Win Rate: 60% (3W - 2L)"`.
- Keep the x-axis (`<XAxis dataKey="dayName" />`) mapped to weekday names (e.g., "Monday", "Tuesday").
- Keep the y-axis (`<YAxis domain={[0, 100]} />`) limited to percentage ranges.

## Examples or Patterns to Follow

```tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartData {
  dayName: string;
  winRate: number;
  wins: number;
  losses: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data: ChartData = payload[0].payload;
    return (
      <div className="chart-tooltip" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '4px' }}>
        <p className="tooltip-title" style={{ fontWeight: 'bold', margin: 0 }}>{label}</p>
        <p className="tooltip-value" style={{ margin: '5px 0 0' }}>
          Win Rate: {data.winRate}% ({data.wins}W - {data.losses}L)
        </p>
      </div>
    );
  }
  return null;
};

export const WeekdayChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="dayName" stroke="var(--color-text-secondary)" />
        <YAxis domain={[0, 100]} stroke="var(--color-text-secondary)" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="winRate" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

## Risks or Caveats

- **Resize performance**: `<ResponsiveContainer>` can trigger frequent redraws if parent container sizing changes rapidly. Avoid wrapping it in containers with dynamic animations.
- **Empty States**: If a weekday has 0 games, Recharts will render a bar height of 0. The custom tooltip must handle 0 game scenarios gracefully without division-by-zero errors.

## Related Harness Documents

| Document | Path | Relationship |
| --- | --- | --- |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Source decision |
