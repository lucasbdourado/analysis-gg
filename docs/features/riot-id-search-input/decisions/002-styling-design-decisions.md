# Task Decision: Styling Design Decisions for Shared UI Components

## Status

Status: Confirmed

Last updated: 2026-06-06

Decision file: `docs/features/riot-id-search-input/decisions/002-styling-design-decisions.md`

## Task Reference

Task ID: `002`

Task file: `docs/features/riot-id-search-input/tasks/002-implement-shared-ui-components.md`

Task plan file: `docs/features/riot-id-search-input/task-plans/002-implement-shared-ui-components-plan.md`

Feature: `riot-id-search-input`

## Context

Styling the shared components requires selecting exact typography font configurations, select caret behaviors, and button style variants before starting implementation to ensure visual consistency and avoid unnecessary refactoring.

## Decision Needed

1. Which Google Font should we use to meet the premium typography requirements?
2. Should the `Button` component support variants (primary/secondary) or only a primary gradient look?
3. Should the `Select` component render a custom caret icon or rely on the native browser arrow?

## Options Considered

### 1. Typography Font
- **Option A**: Use Google Font 'Inter' (recommended for clean, modern readability).
- **Option B**: Use system font fallback (no Google Font loading).
- **Option C**: Use Google Font 'Outfit' (cyberpunk/gaming theme).

### 2. Button variants
- **Option A**: Single primary gradient button.
- **Option B**: Multi-variant button (`primary` and `secondary`).

### 3. Select caret
- **Option A**: Use browser default dropdown caret.
- **Option B**: Use custom inline SVG background icon.

## User Decision

- Typography: **Option A** (Google Font 'Inter').
- Button: **Option A** (Single primary gradient button is sufficient).
- Select: **Option A** (Browser default select arrow is fine).

## Rationale

- **Typography**: Confirmed by the user to use 'Inter' for high readability.
- **Button**: A single gradient button is sufficient because only one search execution trigger is needed on the landing page, avoiding variant bloat in the shared folder.
- **Select**: Reusing the browser's default arrow simplifies the stylesheet logic while maintaining default OS accessibility/interaction styling.

## Impact

- `index.css` will include an `@import` rule for 'Inter' and configure CSS variables `--sans` and `--heading`.
- `Button.module.css` will only implement one primary state mapping to the cyan-emerald gradient.
- `Select.module.css` will not strip browser appearance entirely, allowing standard caret display.

## Date

Decision date: 2026-06-06

## Notes

No follow-up ADRs or external decisions are required. These are localized styling choices.
