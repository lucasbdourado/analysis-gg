# Task: Implement Region Selector and Redirect

## Status

Done

## Task ID

004

## Feature

`docs/features/riot-id-search-input/feature.md`

## Source Documents

- `docs/features/riot-id-search-input/feature.md`
- `docs/features/riot-id-search-input/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Create region configurations, hook up region selections, and execute navigation redirects with URL query variables.

## Context

Once the user enters a valid Riot ID, we must route them to the dashboard. The form needs to load standard Riot server regions, bind the active selection state, and trigger standard client-side redirection.

## Scope

- Create static region mapping configuration at `src/shared/lib/validation/regions.ts` defining platform IDs (e.g. BR1, NA1, EUW1).
- Populate the `Select` options in `SearchForm` using the region mappings.
- Implement redirection logic in the form's submit handler using `useNavigate()`.
- Construct query parameters `?name={gameName}&tag={tagLine}&region={platformId}` mapping values safely using `encodeURIComponent`.

## Out of Scope

- Implementing the target `/dashboard` page data parsing (this is handled by other Phase 1 features).
- Form regex checking (assumed completed).

## Depends On

`003-implement-riot-id-validation-and-form-state.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] Region select is populated with major platform regions (BR1, NA1, EUW1, etc.).
- [x] Valid form submissions parse Riot ID into name and tag parts.
- [x] Redirection forwards to `/dashboard?name={name}&tag={tag}&region={region}`.
- [x] Query parameter names match the design contract.

## Implementation Notes

- Handle spaces and special characters inside names safely using standard URI encodings.
- Set a default selected region in state matching the user's default locale server (e.g., `na1` or `br1`).

## Validation Notes

- Fill out a valid Riot ID, select a region, click "Analyze", and verify that the browser URL updates to the expected dashboard path with parameters.

## Risks

- Query values with special characters decoding incorrectly on the dashboard.

## Open Questions

- None

## Notes for Plan Task

- Read all source documents before creating the implementation plan.
- Keep the plan scoped to this task's goal, dependencies, and acceptance criteria.
