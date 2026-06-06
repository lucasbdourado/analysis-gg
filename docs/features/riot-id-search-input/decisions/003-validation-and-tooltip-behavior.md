# Task Decision: Validation and Tooltip Error Behavior

## Status

Status: Confirmed

Last updated: 2026-06-06

Decision file: `docs/features/riot-id-search-input/decisions/003-validation-and-tooltip-behavior.md`

## Task Reference

Task ID: `003`

Task file: `docs/features/riot-id-search-input/tasks/003-implement-riot-id-validation-and-form-state.md`

Task plan file: `docs/features/riot-id-search-input/task-plans/003-implement-riot-id-validation-and-form-state-plan.md`

Feature: `riot-id-search-input`

## Context

We need to implement validation for the Riot ID input on the SearchForm component. We have two areas of validation: how tooltips are visually displayed, and how validation behaves when focus shifts out of the input (onBlur) with an empty value.

## Decision Needed

1. How should the error tooltip layout be displayed relative to the Riot ID input?
2. What is the expected validation behavior on input blur (focus out) for empty inputs?

## Options Considered

### 1. Error Tooltip Display Layout
- **Option A (Recommended)**: Use the inline error message display provided by the current `Input` component (rendered block-level directly below the input field) styled in error red.
- **Option B**: Implement a custom absolutely-positioned floating overlay tooltip that overlays other elements on the screen.

### 2. Blur Validation Behavior
- **Option A (Recommended)**: On focus out (blur), perform the regex check only if the input is NOT empty. If the input is empty on blur, do not trigger the error tooltip (this prevents showing a 'required' error immediately if the user just tabs through). Presence check ('Riot ID is required') is strictly enforced on submit.
- **Option B**: On focus out (blur), perform both checks (presence and format) immediately. If the input is empty on blur, show 'Riot ID is required' immediately.
- **Option C**: Perform validation only on form submit; do not show errors on focus out (blur).

## User Decision

- **Error Tooltip Display**: Option A (Inline error message display provided by current `Input` component).
- **Blur Validation Behavior**: Option A (Perform regex check on blur only if input is NOT empty; presence check is strictly enforced on submit).

## Rationale

- **Error Tooltip Display**: Confirmed by the user to use the inline error message of the `Input` component. This leverages the existing layout structure of `Input.tsx` and `Input.module.css`, minimizing visual complexity and keeping styles localized.
- **Blur Validation Behavior**: Confirmed by the user to only run format checks on blur if a value exists. This prevents premature error indicators (like "Riot ID is required" when tabs are navigated or before typing starts) while still validating malformed formats early. Empty input will block submission at the form's onSubmit event.

## Impact

- The `SearchForm` component will manage `riotId` and `error` states and pass the `error` string to the `<Input>` component.
- The `handleInputBlur` handler will run the regex match only when `riotId` is not empty. If `riotId` is empty, it will clear any existing error state (or at least not set a new "Riot ID is required" error).
- The `handleSubmit` handler will validate both presence (is `riotId` empty?) and formatting (does `riotId` match regex?), setting the appropriate error states and preventing submission/redirection if invalid.
- Typing in the input will clear the error state.

## Date

Decision date: 2026-06-06

## Notes

None.
