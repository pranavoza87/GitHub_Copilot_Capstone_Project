# Design Review: Task Manager Auto-Search

## Executive Review Summary

The proposed architecture is simple and well aligned with the brownfield application: filtering belongs in the React page over the existing loaded task collection, with no backend, database, package, or API changes. The stakeholder has resolved the description contract as **title-only search**, because the current schema/API has no description field and description support is explicitly out of scope.

The architecture is generally ready for implementation planning, subject to adding a reliable browser-test target and clarifying the no-matches/empty-state behavior during implementation. Search must derive a separate visible array and must not mutate `tasks`.

## Checklist Evaluation

| Area | Status | Findings | Recommendation |
|---|---|---|---|
| Functional coverage | Ready with title-only contract | FR-1 through FR-6 and AC-1, AC-2, AC-3, and AC-4 are covered. The original description acceptance criterion is removed by the agreed title-only decision. | Implement title substring filtering only; remove or ignore any proposed description logic. |
| Architecture quality | Ready | Separation is appropriate: `App.jsx` owns loaded tasks and search state; filtering is a derived local operation; existing API and database boundaries remain unchanged. | Keep filtering inside or beside `App.jsx`; do not add a service, state library, or backend route. |
| Security | Ready | The search is local text; React escapes rendered text; no SQL interpolation or backend request is introduced. | Do not use raw HTML or construct SQL from the query. Continue React text rendering. |
| Performance | Ready | Filtering loaded in-memory records is proportional to loaded task count and is immediate for the small task set. No debounce or API call is appropriate. | Use `toLocaleLowerCase()` or `toLowerCase()` consistently. Avoid repeated API loads or request-scoped work. |
| Reliability | Needs implementation guards | Missing/null titles and malformed payloads need explicit handling. Failed initial loads can currently leave `tasks = []`, while the page also renders “No tasks yet.”, potentially conflating error and empty states. | Preserve the existing error message and do not treat a failed load as a successful empty source. Safely filter only string titles and keep source state unchanged. |
| Testing | Needs frontend coverage | Backend integration tests cover existing APIs but do not cover search. The root package includes Playwright/Playwright-BDD dependencies, but no BDD feature or Playwright spec was found in the inspected workspace. | Add focused Playwright acceptance coverage for title, case, no matches/no message, clearing/order, and zero search requests. Keep existing backend tests as regression coverage. |
| NFR coverage | Mostly ready | Immediate updates, no debounce, source preservation, order preservation, and an accessible label are specified. No quantitative performance or WCAG level was provided. | Implement an associated visible label or `aria-label`; verify keyboard typing and clearing. Treat current React 18/Vite stack as the stated runtime. |
| CI/CD | Needs validation wiring | Root scripts define build and BDD commands, but no search test or CI workflow evidence was found. | Run build and backend tests in CI, plus the Playwright target if a browser runner is configured. |

## Risks, Gaps & Agreed Design Decisions

| ID | Finding | Severity | Decision / Resolution | Impact on `architecture.md` |
|---|---|---|---|---|
| R-01 | Original requirement included description matching, but the SQLite/API contract provides only `id`, `title`, and `status`. | High | Stakeholder chose **A — title-only search**. Requirements and architecture now define title-only matching; description support is out of scope. | Architecture data contract and component/filter wording updated. |
| R-02 | The search field and filtering behavior are not yet present in the existing React UI. | Medium | Add local `searchQuery` state and derive `visibleTasks` with no mutation or API call. | No architecture structure change required. |
| R-03 | Existing `load()` does not distinguish failed loads from an intentionally empty collection. | Medium | Preserve the existing error display and do not confuse source errors with no matches. Search may derive an empty array without changing source or empty/error state. | State/error section remains unchanged but requires implementation to avoid a false empty-result message. |
| R-04 | Malformed individual records may cause unsafe title operations. | Low | Normalize a missing/null/non-string title to an empty string before lower-casing. The API top-level payload should remain an array or follow the existing error path. | Added missing-field handling to the architecture state table. |
| R-05 | No frontend Playwright coverage exists for the acceptance criteria. | High | Add Playwright acceptance tests before implementation is considered complete: title matching, case-insensitive matching, no rows/no no-results message, clear/restored order, and no extra API calls. | Testing choice remains Playwright/BDD. |
| R-06 | No response-time threshold or accessibility standard was supplied. | Low | Interpret “immediate” as no debounce and no request; use an accessible label and standard input semantics. | Documented assumptions retained. |
| R-07 | Existing task order comes from `SELECT ... ORDER BY id DESC`; UI must not sort it. | Low | Filter with `filter()` or equivalent over the source array, preserving relative order. | Architecture end-to-end flow retained. |

## Clarifications & Assumptions Log

| ID | Item | Resolution / Assumption |
|---|---|---|
| C-01 | Description-field API contract gap | Stakeholder selected title-only search (A). The requirements now remove description matching, and the architecture no longer proposes schema/API changes. |
| C-02 | Search scope | Search only the currently loaded task collection. No additional fetch or server-side search. |
| C-03 | Query whitespace | Preserve whitespace exactly and do not trim. A whitespace-only term is therefore significant unless it matches a task title substring. |
| C-04 | Empty query | Match every loaded task and preserve source order. |
| C-05 | No-result UI | Render no task rows and no separate no-results message. The existing “No tasks yet.” message is only appropriate for a truly empty loaded source. |
| C-06 | Accessibility standard | No formal standard was supplied; require an accessible label and normal keyboard operability. |
| C-07 | Performance target | No quantitative threshold was supplied; meet the requirement by synchronous in-memory filtering with no debounce or server round trip. |

## Summary of Updates to `architecture.md`

- Changed search scope from title-or-description to title-only.
- Added an agreed description-field decision.
- Removed optional-description filtering and description API assumptions.
- Updated component responsibilities, data flow, state handling, and Mermaid filtering labels.
- Retained the no-backend, no-schema, no-new-dependency, in-memory design.

## Recommended Implementation Boundaries

1. Add `searchQuery` state and an accessible search input in `App.jsx`.
2. Derive `visibleTasks` by filtering `tasks` by case-insensitive substring in `task.title`.
3. Render `visibleTasks` instead of `tasks`, leaving the source `tasks` array unchanged.
4. Preserve the existing add/edit/delete reload behavior.
5. Add Playwright coverage for all title-only acceptance criteria and absence of search requests.
6. Do not modify `api.js`, Express, SQLite, or package dependencies.
