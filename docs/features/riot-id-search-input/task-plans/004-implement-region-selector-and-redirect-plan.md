# Task Implementation Plan: Implement Region Selector and Redirect

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-id-search-input/task-plans/004-implement-region-selector-and-redirect-plan.md`

## Task Reference

Task ID: `004`

Task file: `docs/features/riot-id-search-input/tasks/004-implement-region-selector-and-redirect.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `riot-id-search-input`

Feature file: `docs/features/riot-id-search-input/feature.md`

Feature Tech Spec: `docs/features/riot-id-search-input/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-id-search-input/tasks/004-implement-region-selector-and-redirect.md` | Entire document | Confirmed by source document | Primary source for task boundaries |
| Feature file | `docs/features/riot-id-search-input/feature.md` | Scope, Completion Criteria | Confirmed by source document | Context and completion requirements |
| Feature Tech Spec | `docs/features/riot-id-search-input/tech-spec.md` | Proposed Technical Approach, Data Contracts, Integration Contracts | Confirmed by source document | Design constraints, routing details, region mappings |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Defines React + TS, react-router-dom, Vanilla CSS |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Component Rules, Presentational/Container components | Confirmed by source document | React architecture constraints |

## Planning Scope

This plan covers task 004 ("Implement Region Selector and Redirect") under the `riot-id-search-input` feature. It outlines the configuration of platform regions, integration into the `SearchForm` component state, and navigation redirection with query variables. It does not authorize the direct modification of application source code.

## Task Summary

Establish a static region mapping configuration utility, wire it to the `SearchForm`'s select dropdown, parse validated Riot IDs, and redirect the browser to `/dashboard` with query parameters on form submit.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `003-implement-riot-id-validation-and-form-state.md` which has been fully completed and marked as `Implemented` in `STATE.md`.

## Feature Context

The `riot-id-search-input` feature provides guest users a simple entry point to query player statistics by inputting their Riot ID and selecting their region. Task 004 connects the validated text input and region selector dropdown to the router, executing the client-side redirection to the dashboard where details are fetched.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Routing and Page Composition | Full | Yes | Redirection path structure and route mappings |
| Region Configuration Mapping | Full | Yes | Mapping region names to platform IDs |
| Integration Contracts | Full | Yes | Redirection format with URL parameters |
| Data Contracts | Full | Yes | Query parameter names (`name`, `tag`, `region`) |
| State and Error Handling | Full | Yes | Redirection transition behavior |

Coverage assessment:
- Justifying Tech Spec section: `Proposed Technical Approach` (Section 1 and 3)
- Tech Spec sections implemented by this task: `Routing and Page Composition`, `Region Configuration Mapping`, `Integration Contracts`, `Data Contracts`
- Gaps between task and Tech Spec: None.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| **React Router (`react-router-dom`)** | `technology-definition.md` | Used to perform the redirect navigation via `useNavigate()` hook |
| **Vite + React + TS** | `technology-definition.md` | Baseline framework for writing components and static utility files |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | `SearchForm` component | Ensures React components have a single responsibility and properly handle form values without directly mutating properties. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Establishes the core technology choices (Vanilla CSS, react-router-dom, etc.) |

No other feature-specific ADRs or architecture decisions constrain this task.

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.tsx` | Active component code | The form to modify | Needs to replace mock regions with new mapping, bind state, and trigger redirect |
| `src/main/frontend/src/shared/ui/Select/Select.tsx` | Select component props | Dropdown UI | Confirmed options type (`SelectOption[]`) and standard props inheritance |
| `src/main/frontend/src/app/routes.tsx` | Router definitions | Target route | Confirmed `/dashboard` route is mapped |

## Confirmed Scope

- Create a configuration file `src/main/frontend/src/shared/lib/validation/regions.ts` that exports:
  - `RegionConfig` interface containing `value: string` and `label: string`.
  - `REGIONS` array containing standard Riot server region metadata (BR1, NA1, EUW1, EUNE1, KR, etc.).
- Update `SearchForm.tsx` to:
  - Setup local state `region` initialized to `'BR1'` (matching the developer's default Brazilian locale).
  - Bind `Select` component value to `region` state and wire its `onChange` handler to set the selected value.
  - Populate the select `options` using the exported `REGIONS` mapping.
  - Implement form submission redirect using the `useNavigate()` hook from `react-router-dom`.
  - Parse the Riot ID on submit by splitting at `#` into `gameName` and `tagLine`.
  - Perform redirection to `/dashboard` with query parameters structured as `?name={encodedName}&tag={encodedTag}&region={lowercasedRegion}` using `encodeURIComponent` to guarantee safe URL generation.

## Out of Scope

- Implementing the dashboard layout or parsing logic on `/dashboard` (handled by other tasks/features).
- Modifying CSS styles of the search landing page or form (assumed completed).
- Running unit tests (this is task 005).

## Proposed Implementation Approach

1. Create a module `regions.ts` under `src/shared/lib/validation/` to export the platform ID metadata.
2. In `SearchForm.tsx`, replace the `dummyRegions` constant with the imported `REGIONS`.
3. Add `region` state hook and hook up state updates to the `Select` component.
4. Import and use `useNavigate()` in `SearchForm.tsx`.
5. In `handleSubmit`, extract `gameName` and `tagLine` from the validated input, format the query parameters, and execute navigation.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/shared/lib/validation/regions.ts` | Create | Confirmed | Task Scope | Static configuration file for Riot platform regions |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.tsx` | Modify | Confirmed | Task Scope | Update state hooks, dropdown properties, and submit handler |

## Implementation Steps

1. **Create `regions.ts` Utility**:
   - Write `src/main/frontend/src/shared/lib/validation/regions.ts`.
   - Export type `RegionOption` matching `{ value: string; label: string; }`.
   - Export array `REGIONS: RegionOption[]` populated with major platform IDs (e.g. `'BR1'`, `'NA1'`, `'EUW1'`, `'EUNE1'`, `'KR'`).
2. **Update `SearchForm.tsx` Imports**:
   - Add import: `import { useNavigate } from 'react-router-dom';`.
   - Add import: `import { REGIONS } from '../../../../shared/lib/validation/regions';`.
3. **Configure Router Navigate**:
   - Add hook invocation: `const navigate = useNavigate();` inside `SearchForm`.
4. **Setup Region State**:
   - Declare state: `const [region, setRegion] = useState('BR1');`.
5. **Bind Select Component**:
   - Replace the `options` prop on `<Select>` with `REGIONS`.
   - Pass `value={region}` and `onChange={(e) => setRegion(e.target.value)}`.
6. **Implement Submit Navigation**:
   - In `handleSubmit`, split the `riotId` input by `#` to extract `gameName` and `tagLine`.
   - Construct URL:
     ```typescript
     const name = encodeURIComponent(gameName.trim());
     const tag = encodeURIComponent(tagLine.trim());
     const lowerRegion = region.toLowerCase();
     navigate(`/dashboard?name=${name}&tag=${tag}&region=${lowerRegion}`);
     ```

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Region select is populated with major platform regions (BR1, NA1, EUW1, etc.) | Populated via `REGIONS` array imported into the Select UI. | Reviewing dropdown options in the browser. |
| Valid form submissions parse Riot ID into name and tag parts | Splitting `riotId.split('#')` inside `handleSubmit`. | URL output check during redirect execution. |
| Redirection forwards to `/dashboard?name={name}&tag={tag}&region={region}` | Using `navigate()` in React Router. | Browser address bar matches query template. |
| Query parameter names match the design contract | Using exact keys: `name`, `tag`, `region`. | Browser address bar keys verification. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Manual redirection check | Manual | Verify that valid form submissions trigger navigation with correct query string parameters. | Submit e.g. `Hide on bush#KR1` with region `KR` and verify browser navigates to `/dashboard?name=Hide%20on%20bush&tag=KR1&region=kr`. |
| Default value verification | Manual | Verify default region is selected on page load. | Dropdown should display 'Brazil' (BR1) by default. |
| Input format encoding check | Manual | Ensure spaces or symbols are escaped properly in redirect URL. | Search `Faker Fan#1234` and verify URL contains `name=Faker%20Fan`. |

## Dependencies

- Depends on Task 003 (`003-implement-riot-id-validation-and-form-state.md` - Implemented).

## Risks and Edge Cases

- **Special Characters inside Riot ID**: Spaces or dots in name parts could break query parameter structures if not properly escaped. *Mitigated by strict usage of `encodeURIComponent`.*
- **Platform Region Case sensitivity**: Backend expectations require lowercased regions (e.g. `br1`). *Mitigated by converting region state to lowercase before redirection.*

## Rollback or Recovery Notes

- To revert modifications, checkout previous version of `SearchForm.tsx` via Git and delete the generated `regions.ts` configuration.

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

- Be sure to use standard React Router `useNavigate` for redirecting.
- The region parameter value must be lowercased in the query string (`region.toLowerCase()`).
- Do not make changes to target `/dashboard` pages.
