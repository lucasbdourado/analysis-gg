# 002 - Weekday Chart and Filter Fixes

This folder contains the research and development specification for the Weekday Chart and Filter Fixes change.

## Why this exists

This spec was created to resolve a bug in the match range slicing logic when queue filters are active, and to fix a rendering issue where "Wednesday" is clipped from the Weekday Performance chart.

## Main sources

- [DashboardContext.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx)
- [WeekdayWinRateChart.tsx](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)

## Main document

- [Change Spec](./change-spec.md)
