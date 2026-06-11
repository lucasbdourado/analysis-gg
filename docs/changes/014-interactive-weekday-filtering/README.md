# 014 - Interactive Weekday Filtering

This folder contains the research and development specification for the interactive weekday filtering feature on the player profile dashboard.

## Why this exists

This spec was created to define how selecting a day of the week on the **Weekday Performance** chart filters other analytical dashboard components (Route Performance, Top Champions, Daily Grid, and Match History), including how it interacts with the existing role filter.

## Main sources

- [DashboardContext.tsx](../../../src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx)
- [WeekdayWinRateChart.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/WeekdayWinRateChart.tsx)
- [RouteWinRateChart.tsx](../../../src/main/frontend/src/features/dashboard/presentation/components/RouteWinRateChart.tsx)

## Main document

- [Change Spec](./change-spec.md)
