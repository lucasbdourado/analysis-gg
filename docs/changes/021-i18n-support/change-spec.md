# Change Spec: Internationalization (i18n) Support

## 1. Overview
The goal is to translate all hardcoded strings in the Analysis.GG dashboard frontend to support multi-language usage. The user selected Portuguese (pt) and English (en) languages, implemented via a lightweight, dependency-free React Context (`LanguageContext`) and a custom hook (`useTranslation`), with a floating language switcher button in the top-right corner of the viewport.

## 2. Research Checklist
- [x] Understand the requested change.
- [x] Identify available source documents.
- [x] Identify the current expected behavior.
- [x] Identify the current actual behavior.
- [x] Analyze directly related code areas.
- [x] Analyze existing tests directly related to the change.
- [x] Identify affected modules, components, APIs or integrations.
- [x] Identify risks, unknowns and assumptions.
- [x] Identify what needs to be created, changed or removed.
- [x] Identify validation and test scenarios.

## 3. Source Context
- User request: Add support for multi-language translations (Portuguese & English).
- Chosen architecture: Custom i18n hook and React context (B), avoiding npm installations like `react-i18next`.
- Layout decision: Floating action button positioned absolutely in the top-right corner of the screen.

## 4. Confirmed Facts
- The application currently uses hardcoded English strings in all components (`SearchForm`, `DashboardPage`, `MatchDetailPage`, etc.).
- Dates are formatted via local timezone but browser-default locale using `new Date().toLocaleString(undefined, ...)`.
- Weekdays are dynamically extracted from match dates and checked against hardcoded English names (`Sunday`, `Monday`, etc.) for filtering state.
- Dynamic coaching tip strings are computed inside `SessionReview.tsx` using complex template strings and champion variables.
- The project has 82 frontend unit tests that run via Vitest/happy-dom and query components using exact English string selectors (e.g. `screen.getByText('Riot ID is required')`, `screen.getByRole('button', { name: /analyze/i })`).

## 5. Inferences and Assumptions
- To prevent existing unit tests from breaking, the `useTranslation` hook must default to English (`en`) when rendered outside of a wrapper provider. This maintains backward compatibility for all existing tests without having to rewrite test selectors or wrap every test component in a provider.
- Local storage can cache the selected language so it persists between reloads.
- Browser locale detection (`navigator.language`) can be used to set the initial language fallback.

## 6. Questions and Answers
- **Question**: Which languages should we support?
  - **Answer**: Portuguese and English.
- **Question**: What i18n framework/library should we use?
  - **Answer**: Option B (lightweight custom translation hook/context with zero external dependencies).
- **Question**: Where should the language switcher be located?
  - **Answer**: A floating button in the top-right corner of the screen.

## 7. Current Behavior
- All application text, buttons, loading screens, and errors are in English and hardcoded in JSX.
- No language switcher exists.
- Date and weekday formatting rely on the browser's implicit locale (`undefined`).

## 8. Expected Behavior
- The interface defaults to English (`en`) or the browser's language (`pt` if Brazilian/Portuguese browser).
- A floating button in the top-right corner allows toggling between "EN" and "PT" (using flag emojis 🇺🇸/🇧🇷 or short text identifiers).
- Toggling the language translates all headings, labels, errors, tooltips, chart legends, table columns, and dynamic coach tips immediately.
- Dates format according to the active locale (`pt-BR` or `en-US`).
- Internal filter state variables (like weekday names `'Monday'`, `'Tuesday'`) remain consistent in English internally, while their visual labels are translated.

## 9. Scope
- Create translations file `translations.ts` with English and Portuguese.
- Create i18n provider (`LanguageContext.tsx`) with dynamic translation function `t()` supporting interpolation (e.g., replacement of `{variable}`).
- Create a floating `LanguageSwitcher` button component.
- Integrate the provider at the root in `App.tsx`.
- Refactor all text-containing components (`SearchLandingPage`, `SearchForm`, `DashboardPage`, `MatchQueueFilter`, `MatchRangeFilter`, `AccountRankedSummary`, `RecentMatchHistory`, `RouteWinRateChart`, `WeekdayWinRateChart`, `DailyPerformanceGrid`, `SessionReview`, `TopChampionsTable`, `MatchDetailPage`) to use `t()`.
- Refactor date/day rendering to pass the current language locale dynamically to formatting functions.

## 10. Out of Scope
- Backend translations (Spring exception messages will remain in English).
- Translating Riot Games assets (e.g., champion names, item names, summoner spell names from Data Dragon).

## 11. Functional Acceptance Criteria
- Loading the page automatically detects browser language (falls back to English if not `pt` or `en`).
- Clicking the language toggle updates all text elements dynamically.
- Toggling language updates local storage so the selection is remembered on subsequent visits.
- Dates format as `MMM D, YYYY` (or local equivalent) for English and corresponding localized formats for Portuguese.
- The floating language switcher behaves responsively and stays visible in the top-right corner without overlapping essential dashboard controls.

## 12. Technical Findings
- Existing date formatters inside `MatchDetailPage.tsx` and `DailyPerformanceGrid.tsx` use `toLocaleDateString(undefined, ...)`. We should replace `undefined` with the active language locale code (`'en-US'` or `'pt-BR'`) to format dates dynamically.
- `WeekdayWinRateChart.tsx` maps day indexes to English strings: `['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']`. When querying `selectedWeekdays`, we must keep these English values in state but map them to localized labels for rendering using `t('weekdays.' + dayName)`.

## 13. Development Guidance
- Build `LanguageContext.tsx` with a `useTranslation` hook that handles fallback gracefully.
- Interpolation support: `t(path, params)` should locate the translation string and replace `{key}` with the value of `params.key`.
- Floating Button style:
  - Fixed position: `position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999;`
  - Style matching the Arena Runeterra design system (gold borders, semi-transparent backdrop, glowing cursor pointer).

## 14. Suggested Code Structure and Contracts

### LanguageContext.tsx
```typescript
import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('analysis_gg_lang');
    if (saved === 'en' || saved === 'pt') return saved;
    const browserLang = navigator.language.substring(0, 2);
    return browserLang === 'pt' ? 'pt' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('analysis_gg_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components tested outside the provider
    return { language: 'en' as Language, setLanguage: () => {} };
  }
  return context;
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current === undefined || current === null) break;
      current = current[key];
    }

    if (typeof current !== 'string') {
      let fallback: any = translations['en'];
      for (const key of keys) {
        if (fallback === undefined || fallback === null) break;
        fallback = fallback[key];
      }
      if (typeof fallback === 'string') {
        current = fallback;
      } else {
        return path;
      }
    }

    if (params) {
      let result = current;
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
      });
      return result;
    }

    return current;
  };

  return { t, language };
}
```

## 15. Validation References
- **Unit tests**: Run `npm run test -- --run` to ensure all 82 existing unit tests continue to pass (English fallback verification).
- **Manual validation**:
  - Open page, verify that text is in Portuguese if browser defaults to PT, or in English.
  - Click floating toggle, verify that all dashboard segments change languages instantly.
  - Verify that dates format according to the chosen locale.
  - Reload page and confirm that the selected language is cached and persists.

## 16. Regression Risks
- Existing Vitest queries might fail if default language resolves to `pt` during test executions. Testing environment normally returns default node environment languages, but ensuring a static fallback to `'en'` in `useLanguage()` when context is missing keeps tests operating in English.
- Filtering by Weekday/Role could break if local translation keys get saved into state instead of English identifiers. The spec strictly guides keeping state values in English (`'Monday'`, `'Top'`) and only localizing them inside render wrappers.

## 17. Open Blockers and Pending Decisions
- None.

## 18. Readiness Checklist
- [x] The requested change is clear.
- [x] The expected behavior is documented.
- [x] The current behavior is documented.
- [x] Relevant sources were reviewed.
- [x] Relevant code areas were reviewed.
- [x] Relevant tests were reviewed.
- [x] Relevant UI behavior was observed.
- [x] Relevant questions were asked.
- [x] User answers were documented.
- [x] Open blockers are documented.
- [x] Pending decisions are documented.
- [x] Development guidance is documented.
- [x] Expected code structure or contracts are documented.
- [x] Suggested validation scenarios are documented.

## 19. Structured Agent Reference
```json
{
  "spec": {
    "index": "021",
    "name": "i18n-support",
    "path": "docs/changes/021-i18n-support/change-spec.md"
  },
  "agentContext": {
    "changeGoal": "Implement multi-language support (English and Portuguese) using a lightweight custom translation provider and floating switcher button in the top-right.",
    "sourceSummary": [
      {
        "type": "user-context",
        "reference": "i18n requested by user",
        "purpose": "Define languages (pt, en), architecture (custom context), and switcher position (floating top-right)."
      },
      {
        "type": "code",
        "reference": "src/main/frontend/src/features",
        "purpose": "Identify components with hardcoded strings and test suites referencing English words."
      }
    ],
    "mustNotUseOtherSkills": true,
    "requiredTools": [],
    "importantConstraints": [
      {
        "constraint": "Maintain backward compatibility for tests without editing test queries.",
        "reason": "By having useLanguage default to 'en' when context is absent, existing tests automatically query in English and pass."
      },
      {
        "constraint": "Keep internal state filters (weekday, roles) in English.",
        "reason": "Ensures analytics filtering arithmetic is unaffected by localization."
      }
    ],
    "userConfirmedDecisions": [
      "Languages: Portuguese and English",
      "Approach: Custom i18n hook and context (no dependencies)",
      "UI: Floating top-right button"
    ],
    "openBlockers": [],
    "pendingDecisions": [],
    "validationFocus": [
      "Run tests to ensure 100% pass rate",
      "Check local storage caching",
      "Verify translation of dynamic tips and dates"
    ]
  }
}
```
