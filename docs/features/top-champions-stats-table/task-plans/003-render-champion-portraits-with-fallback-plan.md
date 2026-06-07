# Task Implementation Plan: Render champion portraits from Riot Data Dragon CDN with fallback placeholders

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/top-champions-stats-table/task-plans/003-render-champion-portraits-with-fallback-plan.md`

## Task Reference

Task ID: `003-render-champion-portraits-with-fallback`

Task file: `docs/features/top-champions-stats-table/tasks/003-render-champion-portraits-with-fallback.md`

Task status: `Depends on Previous Task`

## Feature Reference

Feature name: `top-champions-stats-table`

Feature file: `docs/features/top-champions-stats-table/feature.md`

Feature Tech Spec: `docs/features/top-champions-stats-table/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

List every required document, optional document, guideline, decision, localized codebase evidence item, or explicit user decision used to prepare this plan.

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/top-champions-stats-table/tasks/003-render-champion-portraits-with-fallback.md` | Goal, Scope, Acceptance Criteria | Confirmed by source document | Defines state, image fetching, and error handlers |
| Feature file | `docs/features/top-champions-stats-table/feature.md` | Feature Completion Criteria, Scope | Confirmed by source document | General champion listing visual expectations |
| Feature Tech Spec | `docs/features/top-champions-stats-table/tech-spec.md` | Proposed Technical Approach (3), Testing Strategy | Confirmed by source document | Outlines Data Dragon CDN usage and fallback logic |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Binds language/styling to React + TS & Vanilla CSS |
| Styling Task | `docs/features/top-champions-stats-table/tasks/004-update-table-styling.md` | Scope | Confirmed by source document | Describes CSS alignment and portrait placeholder definitions |
| React guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Presentational Components | Confirmed by source document | Standard React structure and formatting conventions |

## Planning Scope

This planning session is strictly scoped to Task 003. It covers the declaration of the CDN version constant, tracking image error states, setting up the JSX template for conditional image/placeholder rendering in the Champion column, and updating the JSX structure in `TopChampionsTable.tsx`. It does not cover writing CSS declarations (handled in 004) or writing unit tests (handled in 005).

## Task Summary

Render champion portraits dynamically using Riot Data Dragon CDN (`14.11.1`), implementing a local state tracker (`failedImages`) for broken images to display a styled circular fallback placeholder showing the champion's first letter next to their name.

## Execution Eligibility

Status: Eligible

Reason:
- The previous task 002 (`002-implement-stats-aggregation-and-sorting`) is fully implemented, verified, and compiling cleanly (as noted in `docs/STATE.md`).

## Feature Context

The Top Champions Stats Table renders a summary of player performance. Showing champion portrait icons next to their names makes the table visually rich and premium, matching standard league stats apps. The fallback system handles missing champion data dragon assets gracefully.

## Tech Spec Coverage

Explain how the feature Tech Spec covers this task.

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| 3. Champion Portrait Assets | Full | CDN URLs, constant patch version, onError handler toggling fallback state | Covered |
| 5. Styling & Layout | Partial | Wrapping image/fallback in layout JSX structures (`championInfo` wrapper) | Covered (JSX structure only) |
| State: Asset Load Error | Full | Catch image loading errors, update `failedImages`, render letter placeholder | Covered |

Coverage assessment:
- Justifying Tech Spec section: "Proposed Technical Approach" section 3 and "State and Error Handling".
- Tech Spec sections implemented by this task: CDN portrait rendering & first-letter fallback.
- Gaps between task and Tech Spec: None.

## Technology Decisions Used

List confirmed technology decisions that constrain this plan.

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React (Vite + TS) | `technology-definition.md` | Component state hook `useState` and inline handlers used for UI reactivity. |
| Vanilla CSS | `technology-definition.md` | Custom class names mapped from CSS Module imports (`styles.championIcon`, `styles.championFallback`). |

## Applicable Guidelines

Record the internal guidelines consulted for this task.

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| React coding guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | Component structure | Keep presentational structure clean, derived calculations pre-computed, and JSX logic simple. |

## Existing Decisions Reviewed

```text
No existing feature, ADR, or architecture decision was relevant to this task.
```

## Local Codebase References

Record only localized codebase checks directly related to this task.

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Champion column cell rendering in tbody | Code area to refactor | Currently rendering raw championName text inside `td`. |

## Confirmed Scope

List the work confirmed to be part of this task.

- Add a configurable patch constant `CHAMPION_ASSET_VERSION = '14.11.1'` at the top of `TopChampionsTable.tsx`.
- Add local state `failedImages` in `TopChampionsTable.tsx` initialized as an empty record: `const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});`.
- Add `handleImageError` helper callback to set `failedImages[championName] = true`.
- Refactor the table body cell for the Champion column to wrap inside a `styles.championInfo` container:
  - If `failedImages[champ.championName]` is true, render a circular `styles.championFallback` div containing `champ.championName.charAt(0)`.
  - Otherwise, render an `<img>` tag with `src` pointing to Riot CDN, `alt` set to `champ.championName`, and `onError` calling `handleImageError`.
  - Render a `span` with class `styles.championNameText` displaying `champ.championName`.
- Verify the project builds successfully with `npm run build`.

## Out of Scope

List related work that must not be done in this task.

- Adding CSS declarations for `styles.championInfo`, `styles.championFallback`, `styles.championIcon`, or `styles.championNameText` in `TopChampionsTable.module.css` (Task 004).
- Creating/updating unit tests in `TopChampionsTable.test.tsx` (Task 005).

## Proposed Implementation Approach

1. **Asset Version Constant**: Place `const CHAMPION_ASSET_VERSION = '14.11.1';` outside the component scope to keep it as a clean configuration token.
2. **State Management**: Declare `failedImages` state inside the component function block.
3. **Event Handler**: Define a memoized or standard handler `handleImageError` to map the loaded image error events to our state dictionary.
4. **JSX Structural Refactoring**: Update the `td` cell layout to flex-align the portrait (or fallback) and name using wrapper CSS modules class references that will be styled in Task 004.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx` | Modify | Confirmed | Codebase | Refactor component state and cell JSX |

## Implementation Steps

Give the future `execute-task` agent a focused sequence of implementation steps.

1. Open `src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`.
2. Declare `const CHAMPION_ASSET_VERSION = '14.11.1';` at the top of the file (outside the component function block).
3. Inside the `TopChampionsTable` component function, add the local state hook:
   ```typescript
   const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});
   ```
4. Declare the image error callback handler:
   ```typescript
   const handleImageError = (championName: string) => {
     setFailedImages((prev) => ({ ...prev, [championName]: true }));
   };
   ```
5. Navigate to the table row renderer inside `tbody` (around line 195).
6. Replace the `td` element for the champion name:
   ```tsx
   <td className={`${styles.tdLeft} ${styles.championNameCell}`}>
     {champ.championName}
   </td>
   ```
   with the following JSX structure:
   ```tsx
   <td className={`${styles.tdLeft} ${styles.championNameCell}`}>
     <div className={styles.championInfo}>
       {failedImages[champ.championName] ? (
         <div 
           className={styles.championFallback} 
           data-testid={`fallback-${champ.championName}`}
         >
           {champ.championName.charAt(0)}
         </div>
       ) : (
         <img
           src={`https://ddragon.leagueoflegends.com/cdn/${CHAMPION_ASSET_VERSION}/img/champion/${champ.championName}.png`}
           alt={champ.championName}
           className={styles.championIcon}
           onError={() => handleImageError(champ.championName)}
         />
       )}
       <span className={styles.championNameText}>{champ.championName}</span>
     </div>
   </td>
   ```
7. Verify that the project compiles correctly:
   - Run `npm run build` from the `src/main/frontend` directory.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Champion portraits are fetched from Riot Data Dragon CDN version `14.11.1`. | Rendered `img` tags point to version `14.11.1` from Data Dragon CDN. | Verified manually and via future component tests in Task 005. |
| Images that fail to load trigger the `onError` handler. | `onError` calls `handleImageError(champ.championName)`. | Verified manually and via future component tests in Task 005. |
| If an image fails to load, a fallback circular element with the champion's first letter is displayed instead. | Toggles `failedImages[champ.championName]` to render `styles.championFallback` container. | Verified manually by changing URL to invalid path and checked in Task 005. |
| The UI displays names alongside the portraits/placeholders cleanly. | Wraps portrait/fallback and text in a shared `styles.championInfo` flex layout. | Verified visually in browser during Task 004 execution. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `npm.cmd run build` | Compilation | Verify type-safety and bundle compiler output. | Run in `src/main/frontend` |
| Manual URL tampering | Visual check | Tamper with CDN path (e.g. invalid domain or folder) and verify fallback character is drawn in a circular shape for all rows. | Done during development |

## Dependencies

- Dependency: Task `002-implement-stats-aggregation-and-sorting.md` must be completed (Satisfied: Status is `Implemented`).

## Risks and Edge Cases

- **Mismatched Champion Names**: Some champion names from the API (like "FiddleSticks", "MonkeyKing") might have specific CDN filename mismatches.
  * *Mitigation*: The `onError` listener automatically catches any 404/image loading errors and shows the first letter placeholder, preventing broken images.

## Rollback or Recovery Notes

- Revert the changes to the React component:
  `git checkout -- src/main/frontend/src/features/dashboard/presentation/components/TopChampionsTable.tsx`

## Pending Decisions

```text
None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.
```

## Questions for the User

```text
None. All task-relevant questions have been answered.
```

## Decisions Created During Planning

```text
No local feature/task decisions were created during this planning session.
```

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

- Ensure the custom test attributes (`data-testid={`fallback-${champ.championName}`}`) are accurately set up to make writing Vitest assertions simple in Task 005.
- Do not write stylesheet definitions in `TopChampionsTable.module.css` yet, as that is explicitly handled in Task 004.
