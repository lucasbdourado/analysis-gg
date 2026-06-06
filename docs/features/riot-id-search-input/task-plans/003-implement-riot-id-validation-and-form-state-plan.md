# Task Implementation Plan: Implement Riot ID Validation and Form State

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-id-search-input/task-plans/003-implement-riot-id-validation-and-form-state-plan.md`

## Task Reference

Task ID: `003`

Task file: `docs/features/riot-id-search-input/tasks/003-implement-riot-id-validation-and-form-state.md`

Task status: `Depends on Previous Task` (eligible now since dependency 002 is Implemented)

## Feature Reference

Feature name: `riot-id-search-input`

Feature file: `docs/features/riot-id-search-input/feature.md`

Feature Tech Spec: `docs/features/riot-id-search-input/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-id-search-input/tasks/003-implement-riot-id-validation-and-form-state.md` | Goal, Scope, Out of Scope, Acceptance Criteria | Confirmed by source document | Primary task scope |
| Feature file | `docs/features/riot-id-search-input/feature.md` | Scope, Feature Completion Criteria | Confirmed by source document | Functional context |
| Feature Tech Spec | `docs/features/riot-id-search-input/tech-spec.md` | Form Validation Strategy, State and Error Handling | Confirmed by source document | Validation logic & error details |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Styling & React constraints |
| State Management | `.agents/docs/architecture/react-coding-guidelines/state-management.md` | Local State, Derived State | Confirmed by source document | React hooks usage guidelines |
| Styling Decisions | `docs/features/riot-id-search-input/decisions/002-styling-design-decisions.md` | Typography & styling preferences | Confirmed by source document | Local styling rules |
| Validation Decisions | `docs/features/riot-id-search-input/decisions/003-validation-and-tooltip-behavior.md` | Error tooltip & blur validation options | Confirmed by user decision | User confirmed behaviors |

## Planning Scope

This plan covers task `003` (Implement Riot ID Validation and Form State). It outlines the creation of validation helpers in `src/shared/lib/validation/riotId.ts`, integration of state hooks (`useState`) for input and error management in `SearchForm.tsx`, handling change, blur, and submit events, and styling of any local layout files. It does not cover region metadata mapping (task `004`), navigation redirection execution (task `004`), or writing unit tests (task `005`).

## Task Summary

Wire the form states in `SearchForm.tsx` to handle user input (`riotId`), run validation (empty presence check and regex pattern matching), display error tooltips inline via the shared `Input` component, and clear error highlights during typing or upon corrected validation states.

## Execution Eligibility

Status: Eligible

Reason:
- Task depends on `002-implement-shared-ui-components.md` which has been marked as `Implemented`. The shared `Input`, `Select`, and `Button` components are ready and styled with their focus/error states.

## Feature Context

To onboarding guest users without account requirements, the system must capture their Riot ID in the format `GameName#Tagline`. We need to block malformed submissions on the client side, providing clear inline error feedback.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Form Validation Strategy | Full | Implementing regex check `^[a-zA-Z0-9\s_.-]{3,16}#[a-zA-Z0-9]{3,5}$` | Handled client-side in helper and component |
| State and Error Handling | Full | Setting local state on empty or malformed strings | Inline tooltip styled in error red (`hsl(350, 80%, 55%)`) |
| Validation Rules | Partial | Presence check and format regex checks | Region verification is out of scope (handled in Task 004) |

Coverage assessment:
- Justifying Tech Spec section: Form Validation Strategy (lines 88-95), State and Error Handling (lines 174-183), Validation Rules (lines 184-191).
- Tech Spec sections implemented by this task: Client-side validation logic and error feedback state.
- Gaps between task and Tech Spec: Region Selector verification (statically allowed list checks) is handled in Task 004.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| React Hooks (`useState`) | `technology-definition.md` | Managing form input (`riotId`) and validation error (`error`) locally in `SearchForm` |
| Vanilla CSS (CSS Modules) | `technology-definition.md` | Utilizes standard CSS modules styling from `Input.module.css` for error overlays |
| ES6 Regular Expression | `tech-spec.md` | Standard regex matching pattern for Riot ID format validation |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| State Management | `.agents/docs/architecture/react-coding-guidelines/state-management.md` | Local state hooks | State is kept local to `SearchForm` to minimize unnecessary parent re-renders. Avoid derived state pitfalls. |
| Component Guidelines | `.agents/docs/architecture/react-coding-guidelines/component-guidelines.md` | React component state | Coordinates local state safely and passes it to shared UI controls. |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| Styling Design Decisions | `docs/features/riot-id-search-input/decisions/002-styling-design-decisions.md` | Base font and CSS configurations are verified |
| Validation and Tooltip Behavior | `docs/features/riot-id-search-input/decisions/003-validation-and-tooltip-behavior.md` | Confirmed displaying inline errors and regex blur checks |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `src/main/frontend/src/features/search/presentation/components/SearchForm.tsx` | Present dummy implementation | Needs to be wired with state hooks | Currently holds mock handlers and static props |
| `src/main/frontend/src/shared/ui/Input/Input.tsx` | Checking error prop rendering | Confirmed it displays string error block | Renders error text in `<span className={styles.errorText}>` |

## Confirmed Scope

- Create a shared validation module `src/main/frontend/src/shared/lib/validation/riotId.ts` containing the regex pattern and validation function.
- Add `riotId` state and `error` state inside `SearchForm.tsx`.
- Connect state variables to the `<Input>` component props: `value`, `onChange`, `onBlur`, and `error`.
- Implement a `handleInputChange` handler that sets `riotId` and clears any active `error` state (as typing should hide/clear tooltips).
- Implement a `handleInputBlur` handler that checks if `riotId` is not empty, validates it against the regex, and sets the `error` state if malformed (clearing error if valid).
- Implement a `handleSubmit` handler that blocks the form submit, validates presence (error if empty), validates formatting (error if malformed), and prevents further redirection if errors are found.

## Out of Scope

- Defining region list configurations and dropdown selector options (task 004).
- Navigating / redirecting to `/dashboard` route with parameters (task 004).
- Adding Vitest/RTL unit tests (task 005).

## Proposed Implementation Approach

1. **Create validation helper**: Implement `src/shared/lib/validation/riotId.ts`. Declare regex `RIOT_ID_REGEX` and write a validation function returning `{ isValid: boolean; error?: string }`.
2. **Wire state hooks in SearchForm**: Import `useState` and add states for `riotId` (string) and `error` (string | undefined).
3. **Change handler**: Implement `onChange` callback to update `riotId` and clear `error` if present.
4. **Blur handler**: Implement `onBlur` callback. If the field is not empty, run validation helper. If it is empty, clear error (per user decision).
5. **Submit handler**: Implement `onSubmit` callback. Perform full presence and regex validation. If invalid, set error and prevent form navigation. If valid, log a checkpoint message (redirection placeholder).

## Expected Files or Areas

All paths are relative to `src/main/frontend`:

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `src/shared/lib/validation/riotId.ts` | Create | Confirmed | Task File (line 62) | Shared validation logic |
| `src/features/search/presentation/components/SearchForm.tsx` | Modify | Confirmed | Task File (line 31) | Event handlers and state hooks |

## Implementation Steps

1. **Create validation module**:
   - Write `src/main/frontend/src/shared/lib/validation/riotId.ts`:
     ```typescript
     export const RIOT_ID_REGEX = /^[a-zA-Z0-9\s_.-]{3,16}#[a-zA-Z0-9]{3,5}$/;

     export interface ValidationResult {
       isValid: boolean;
       error?: string;
     }

     export const validateRiotId = (value: string): ValidationResult => {
       const trimmed = value.trim();
       if (!trimmed) {
         return { isValid: false, error: 'Riot ID is required' };
       }
       if (!RIOT_ID_REGEX.test(trimmed)) {
         return { isValid: false, error: 'Format must be Name#Tag' };
       }
       return { isValid: true };
     };
     ```
2. **Wire SearchForm states and handlers**:
   - Import `validateRiotId` in `src/main/frontend/src/features/search/presentation/components/SearchForm.tsx`.
   - Setup states: `const [riotId, setRiotId] = useState('');` and `const [error, setError] = useState<string | undefined>(undefined);`.
   - Update `onChange` for `Input` to a handler:
     ```typescript
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setRiotId(e.target.value);
       if (error) {
         setError(undefined);
       }
     };
     ```
   - Add `onBlur` handler:
     ```typescript
     const handleInputBlur = () => {
       if (riotId.trim() !== '') {
         const result = validateRiotId(riotId);
         if (!result.isValid) {
           setError(result.error);
         } else {
           setError(undefined);
         }
       } else {
         // Clear error if empty on blur per user decision
         setError(undefined);
       }
     };
     ```
   - Update `handleSubmit` handler:
     ```typescript
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       const result = validateRiotId(riotId);
       if (!result.isValid) {
         setError(result.error);
         console.warn(`Validation failed: ${result.error}`);
         return;
       }
       setError(undefined);
       console.log('Validation passed. Riot ID:', riotId);
       // Redirection will be implemented in Task 004
     };
     ```
3. **Verify compilation**:
   - Run compilation command check inside `src/main/frontend` to verify that no TypeScript or import syntax errors exist.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| Typing in input synchronizes text state and hides tooltips when active. | `handleInputChange` updates state and calls `setError(undefined)`. | Manual testing: entering text clears error styling on the input field. |
| Submitting empty input prevents form action and shows `"Riot ID is required"` tooltip. | `validateRiotId` returns error on empty input; `handleSubmit` blocks execution and sets error state. | Manual testing: clicking "Analyze" with empty field flags red outline and text under input. |
| Submitting invalid string format (e.g. no `#`, too short name, too long tag) sets error state and shows `"Format must be Name#Tag"` tooltip. | Regex pattern checks formatting; displays correct error message on failed validation. | Manual testing: inputting malformed string triggers error message. |
| Valid formats clear error states and pass validation checkpoint. | `validateRiotId` clears error; `handleSubmit` prints success log checkpoint without blocking. | Console log checkpoint verification. |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| Build Check | Build Verification | Verify Vite compiles successfully without TypeScript or module resolution errors | Run `npm run build` |
| Form Interaction Manual Check | Manual UI inspection | Manually test typing, blurring, and submit validations to check HSL error outlines and messages | Run `npm run dev` and test validation flows |

## Dependencies

- Depends on Task `002-implement-shared-ui-components.md` (Already marked `Implemented`).

## Risks and Edge Cases

- **Regex edge cases**: Riot IDs containing characters like hyphens or dots. Confirmed regex `/^[a-zA-Z0-9\s_.-]{3,16}#[a-zA-Z0-9]{3,5}$/` includes `_.-` and whitespace. This successfully mitigates risks.
- **Client Sanitization**: Stripping any potential script tag triggers. Checked by keeping standard React JSX rendering which naturally escapes html inputs.

## Rollback or Recovery Notes

- Rollback changes using git:
  ```bash
  git checkout -- src/main/frontend/src/features/search/presentation/components/SearchForm.tsx
  rm -f src/main/frontend/src/shared/lib/validation/riotId.ts
  ```

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

| Decision | Path | Reason |
| --- | --- | --- |
| Validation and Tooltip Behavior | `docs/features/riot-id-search-input/decisions/003-validation-and-tooltip-behavior.md` | Record user preference on validation flows and error tooltips |

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

- Ensure you place the validation helper in the exact file: `src/shared/lib/validation/riotId.ts`.
- Make sure to clear the error state inside `onChange` to satisfy the "Typing in input hides tooltips when active" criterion.
- Log validation failures using `console.warn` as specified in the Observability section of the Tech Spec.
