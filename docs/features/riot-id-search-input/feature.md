# Feature: Riot ID Search Input

## Status

Status: Confirmed
Last updated: 2026-06-04
Owner or primary stakeholder: lucas.dourado

## Product Name

Analysis.GG

## Source Documents

| Source | Location or Reference | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| Full Product PRD | docs/product/analysis-gg/full-product-prd.md | Full Product PRD | Confirmed | Approved on June 4, 2026 |
| MVP PRD | docs/product/analysis-gg/mvp-prd.md | MVP PRD | Confirmed | Approved on June 4, 2026 |
| Project Planning | docs/planning/analysis-gg/project-planning.md | Planning | Confirmed | Approved on June 4, 2026 |

## Feature Goal

Render a search interface that accepts a user's Riot ID and region, validating the input format before redirecting the user to the analytics dashboard.

## User Value

Provides a simple, direct onboarding flow. Guest users can inspect any player's profile instantly without needing to create an account.

## Related PRD Capabilities

| Capability ID | Capability | Source |
| --- | --- | --- |
| CAP-001 | Player Profile & Riot API Sync | MVP PRD |

## Related PRD Features

| Feature ID | Feature | Source | Priority |
| --- | --- | --- | --- |
| MVP-F-001 | Riot ID Search Input (Name#Tagline + Region Selector) | MVP PRD | Must |

## Related User Stories

| User Story ID | User Story | Source |
| --- | --- | --- |
| MVP-US-001 | As a player, I want to search my Riot ID so that my ranked matches load automatically. | MVP PRD |

## Expected Outcome

A clean input form with validation logic for the Riot ID (alphanumeric, max length, `#` separator, tag) and a select menu for target region servers. Form submission triggers redirection to the dashboard page with query variables (e.g. `?name=Player&tag=BR1&region=br1`).

## Scope

- Responsive form layout on the landing page.
- Validation logic on input (prevent submit and show hint if invalid).
- Selection of active LoL server regions.
- Navigation redirection to the dashboard page upon submit.

## Out of Scope

- Search history (recent searches) or profile autocomplete.
- Saving profiles in a database (lookup only).

## Dependencies

| Dependency | Type | Required For | Status | Notes |
| --- | --- | --- | --- | --- |
| Region server list | Documentation | Dropdown selection options | Confirmed | Need list of supported Riot regions (e.g., BR1, NA1, EUW1). |

## Risks

| Risk | Impact | Likelihood | Mitigation or Follow-Up | Status |
| --- | --- | --- | --- | --- |
| Confusing error messages for typing mistakes | Medium | Medium | Provide instant regex feedback on input field focus-out. | Open |

## Feature Completion Criteria

- [ ] Riot ID input validates format (`Name#Tagline`) before allowing submit.
- [ ] Region selection dropdown is populated with supported servers.
- [ ] Clicking "Analyze" redirects user to `/dashboard` with query parameters.
- [ ] Empty state input shows error tooltip when clicking "Analyze".

## Readiness Notes for Tech Spec

- Form regex: `^[a-zA-Z0-9\s]{3,16}#[a-zA-Z0-9]{3,5}$` or appropriate Riot API specifications.
- List of API routing regions vs. platform server IDs.

## Inputs for Create Tasks

- Create task for landing page layout and styling.
- Create task for search form input validation.
- Create task for region selector configurations.
- Create task for dashboard routing.

## Open Questions

| Question | Impact | Blocks Next Step? | Suggested Owner |
| --- | --- | --- | --- |
| What is the maximum character length for Riot IDs in modern accounts? | Low | No | Tech |
