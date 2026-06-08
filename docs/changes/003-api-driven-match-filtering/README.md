# 003 - API-Driven Match Filtering

This folder contains the research and development specification for the API-Driven Match Filtering change.

## Why this exists

This spec was created to gather and organize the relevant context before development, transitioning the queue filters to trigger API calls directly, ensuring that stats are analyzed over correct queue populations.

## Main sources

- User request & decision confirmation
- Riot API Match-V5 documentation
- `src/main/frontend/src/features/dashboard/presentation/context/DashboardContext.tsx`
- `src/main/java/com/analysisgg/modules/riotapi/application/usecase/SyncPlayerProfileUseCase.java`

## Main document

- [Change Spec](./change-spec.md)
