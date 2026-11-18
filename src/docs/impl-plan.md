# Implementation Plan

## Overview

This plan implements title-only, immediate, client-side task search in the existing React page. It preserves the current Express, SQLite, API client, package dependencies, and task ordering. The implementation will add search state and derived visible-task rendering to `Task_Manager_App/frontend/src/App.jsx`, presentation in `Task_Manager_App/frontend/src/styles.css`, and browser acceptance coverage using the existing Playwright/Playwright-BDD tooling.

The plan is based on `src/docs/requirements.md`, `src/docs/architecture.md`, `src/docs/design-review.md`, and the existing code under `Task_Manager_App/`. Backend routes and data contracts remain unchanged.

## Assumptions

- The implementation team may modify frontend source and test configuration under `Task_Manager_App/`, but not backend, database, or API client behavior.
- Search text is preserved exactly, including leading and trailing whitespace; it is not trimmed.
- A case-insensitive substring comparison uses one consistent JavaScript lower-casing operation for both the query and each string title.
- Missing, `null`, or non-string task titles are treated as empty titles and do not break filtering.
- The existing task collection is considered source state and is never mutated or sorted.
- No quantitative response-time or formal accessibility standard applies beyond synchronous local filtering and an associated accessible label.
- Playwright BDD artifacts will use the repository's existing root scripts and CI workflow; no dependency or package manifest changes are required.

## Task Breakdown

### T-01: Establish baseline verification

- **Description:** Run the existing frontend build and backend integration tests before source changes, and record the baseline result.
- **Target Files:** `Task_Manager_App/frontend/package.json`, `Task_Manager_App/backend/package.json`, existing test files under `Task_Manager_App/backend/test/`
- **Priority:** P1 - Critical Foundation
- **Dependencies:** None
- **Deliverable:** Confirmed baseline build/test status and identified pre-existing failures, if any.

### T-02: Add search state to the task page

- **Description:** Add a `searchQuery` state value in `App` and keep it independent from the existing `tasks` and add-title state.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P1 - Critical Foundation
- **Dependencies:** T-01
- **Deliverable:** Search text can be held in React state without changing the loaded task collection.

### T-03: Add an accessible search input

- **Description:** Render a task search input alongside the existing add form and update `searchQuery` on every input change. Associate a visible label or `aria-label` that identifies the control as task search.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`, `Task_Manager_App/frontend/src/styles.css`
- **Priority:** P1 - Critical Foundation
- **Dependencies:** T-02
- **Deliverable:** A keyboard-operable, clearly labeled search control with no submit behavior or intentional delay.

### T-04: Define the title-only filter behavior

- **Description:** Derive `visibleTasks` from `tasks` and `searchQuery` using title-only, case-insensitive substring matching. Normalize missing, `null`, or non-string titles to an empty searchable title and preserve the relative order of the source array.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P1 - Critical Foundation
- **Dependencies:** T-02
- **Deliverable:** A derived array that handles empty, positive, and zero-match queries without mutating `tasks`.

### T-05: Render the derived visible task list

- **Description:** Replace task-list rendering over `tasks` with rendering over `visibleTasks`, while retaining existing `TaskItem` add/edit/delete behavior and task keys.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P2 - Core Features
- **Dependencies:** T-04
- **Deliverable:** Only matching source tasks are rendered, in source order.

### T-06: Correct empty-state rendering for filtered results

- **Description:** Ensure “No tasks yet.” is shown only for a genuinely empty loaded task collection, not merely for a filtered result with zero matches. Render no separate no-results message.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P2 - Core Features
- **Dependencies:** T-04, T-05
- **Deliverable:** Zero-match searches render no task rows and no no-results/empty-result message.

### T-07: Guard loaded collection state and load errors

- **Description:** Confirm a successful task load supplies an array before updating source state, and preserve the existing error display for failed loads. Do not treat load failures as successful empty task collections.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P2 - Core Features
- **Dependencies:** T-01
- **Deliverable:** Search operates from valid source-array state while preserving existing load-error behavior.

### T-08: Preserve existing mutation and reload behavior

- **Description:** Verify add, edit, delete, and post-mutation reload paths continue to update source tasks and then apply the current search query to the refreshed collection. Make no API or backend changes.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`
- **Priority:** P2 - Core Features
- **Dependencies:** T-04, T-05
- **Deliverable:** Existing task workflows remain usable while a search is active.

### T-09: Style the search field consistently

- **Description:** Add the search control to the existing layout with plain CSS, retaining the add form and task-list presentation. Add small-screen-safe flex and sizing behavior only if required by the existing layout.
- **Target Files:** `Task_Manager_App/frontend/src/styles.css`
- **Priority:** P3 - Supporting Features
- **Dependencies:** T-03
- **Deliverable:** The search field is visible and usable beside or above the loaded task list without layout overflow.

### T-10: Establish browser test target for search

- **Description:** Add a focused Playwright/Playwright-BDD feature and step/spec target for the search behavior, using the repository's existing `test:bdd` scripts and the Playwright configuration conventions already supported by the root package.
- **Target Files:** `Task_Manager_App/tests/` and relevant Playwright-BDD configuration or generated target files under `Task_Manager_App/`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-01
- **Deliverable:** A runnable browser-test location and configuration integrated with `npm run test:bdd`.

### T-11: Add title and case-matching acceptance coverage

- **Description:** Add browser acceptance scenarios for typing “book” to show only “Book flights” and searching “BOOK” with case-insensitive matching. Verify no submit action or filtering delay is required.
- **Target Files:** Browser feature/spec/step files under `Task_Manager_App/tests/`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-05, T-10
- **Deliverable:** Automated coverage for AC-1 and AC-2.

### T-12: Add no-match and clearing acceptance coverage

- **Description:** Add browser acceptance scenarios for a term with zero matches showing no task rows and no separate no-results message, and for clearing the search restoring all loaded tasks in existing order.
- **Target Files:** Browser feature/spec/step files under `Task_Manager_App/tests/`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-05, T-06, T-10
- **Deliverable:** Automated coverage for AC-3 and AC-4.

### T-13: Add zero-search-request and source-order verification

- **Description:** Count `/api/tasks` requests during typing and clearing and verify the initial load is the only task collection request. Verify matching rows retain source order and clearing does not alter task data.
- **Target Files:** Browser feature/spec/step files under `Task_Manager_App/tests/`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-10, T-11, T-12
- **Deliverable:** Browser evidence for FR-6 and NFR-3.

### T-14: Add backend regression verification

- **Description:** Run the existing Node integration suites unchanged and verify no backend behavior, API route, schema, or package contract regressed.
- **Target Files:** `Task_Manager_App/backend/test/tasks.enhancements.test.js`, `Task_Manager_App/backend/test/tasks.patch.test.js`, `Task_Manager_App/backend/test/tasks.post-status.test.js`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-05
- **Deliverable:** Backend regression result showing unchanged API behavior.

### T-15: Update CI validation

- **Description:** Confirm the existing BDD workflow installs dependencies and Chromium and runs `npm run test:bdd`; add frontend build and backend test steps if they are not already treated as release gates.
- **Target Files:** `Task_Manager_App/.github/workflows/bdd-tests.yml`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-10, T-11, T-12, T-13, T-14
- **Deliverable:** Automated CI gate covering browser search, frontend build, and backend regression tests.

### T-16: Perform release readiness validation

- **Description:** Run the frontend build, backend tests, browser BDD tests, and inspect the UI at desktop and narrow viewport widths. Confirm no search request occurs, whitespace remains significant, and no source sorting or mutation occurs.
- **Target Files:** `Task_Manager_App/frontend/src/App.jsx`, `Task_Manager_App/frontend/src/styles.css`, browser tests and reports under `Task_Manager_App/tests/`
- **Priority:** P3 - Supporting Features & Automated Tests
- **Dependencies:** T-08, T-09, T-13, T-14, T-15
- **Deliverable:** Complete verification result and resolved or documented blockers.

## Dependency Order

1. Establish the baseline (T-01).
2. Add independent search state and load guards (T-02, T-07).
3. Add the accessible search input and filter derivation (T-03, T-04).
4. Render `visibleTasks` and distinguish loaded-empty from filtered-empty state (T-05, T-06).
5. Preserve mutation/reload behavior and style the control (T-08, T-09).
6. Establish the browser test target (T-10).
7. Add acceptance coverage for matching, clearing, no matches, order, and request count (T-11, T-12, T-13).
8. Run backend regression tests (T-14).
9. Extend CI validation (T-15).
10. Complete release readiness validation (T-16).

## Parallel Work Opportunities

- T-02 and T-07 may proceed together because search state and loaded-collection validation affect separate areas of `App.jsx`.
- T-03 and T-04 may proceed together after T-02 is understood.
- T-09 can proceed alongside T-05/T-06 once the search input markup is known.
- T-10 can be prepared independently during frontend implementation.
- T-11, T-12, and T-14 can proceed in parallel once their respective dependencies are satisfied.
- T-15 can be prepared after test targets are present while final test fixes are in progress.

## Blocked Tasks

| Task | Blocked By | Status |
|---|---|---|
| T-02: Add search state | T-01 baseline verification | Ready after T-01 |
| T-03: Add accessible search input | T-02 search state | Blocked |
| T-04: Define title-only filter behavior | T-02 search state | Blocked |
| T-05: Render derived visible list | T-04 filter behavior | Blocked |
| T-06: Correct empty-state rendering | T-04 filter behavior and T-05 visible rendering | Blocked |
| T-07: Guard loaded collection state | T-01 baseline verification | Ready after T-01 |
| T-08: Preserve mutation/reload behavior | T-04 and T-05 | Blocked |
| T-09: Style search field | T-03 search input markup | Blocked |
| T-10: Establish browser test target | T-01 baseline verification | Ready after T-01 |
| T-11: Add title/case acceptance coverage | T-05 and T-10 | Blocked |
| T-12: Add no-match/clearing coverage | T-05, T-06, and T-10 | Blocked |
| T-13: Add request/order verification | T-10, T-11, and T-12 | Blocked |
| T-14: Add backend regression verification | T-05 implementation boundary confirmation | Blocked |
| T-15: Update CI validation | T-10 through T-14 | Blocked |
| T-16: Release readiness validation | T-08, T-09, T-13, T-14, and T-15 | Blocked |

## Milestones

### M1: Foundation and baseline

Tasks: T-01, T-02, T-07

Outcome: Baseline behavior is established, search state exists, and loaded task state is safely handled.

### M2: Core title search

Tasks: T-03, T-04, T-05, T-06, T-08

Outcome: The UI provides accessible, immediate title-only filtering, clear behavior, no-match behavior, and preserved task mutations.

### M3: Presentation and browser coverage

Tasks: T-09, T-10, T-11, T-12, T-13

Outcome: The search control fits the existing UI and acceptance coverage proves filtering, clearing, order, empty behavior, and zero search requests.

### M4: Regression and release readiness

Tasks: T-14, T-15, T-16

Outcome: Backend behavior remains unchanged, CI runs the complete gate, and the implementation is ready for release.

## Risks

| Risk | Mitigation |
|---|---|
| A failed initial load could be mistaken for an empty loaded collection. | Preserve the existing error state and show “No tasks yet.” only when `tasks` is truly a successful empty array. |
| Search could mutate or sort the source task array. | Use `filter()` to produce `visibleTasks`; never call sorting or mutation methods on `tasks`. |
| Missing or malformed titles could throw during lower-casing. | Normalize missing, `null`, and non-string titles to `''` before comparison. |
| Browser test data may not match stable acceptance titles. | Seed or intercept a known task collection for search scenarios, using existing app startup and API behavior. |
| A no-match search may accidentally render the existing empty message. | Tie the empty message to `tasks.length === 0`, not `visibleTasks.length === 0`. |
| Search input markup or styling could reduce accessibility or keyboard usability. | Use an associated visible label or `aria-label`, native input semantics, and normal focus behavior. |
| A browser test could fail to detect extra search API requests. | Record network requests and assert that only the initial task load issues `/api/tasks` while typing and clearing. |
| CI may lack build/config coverage for a newly added browser target. | Extend the existing workflow only after confirming its `npm run test:bdd` target discovers the new feature/spec. |

## Suggested Implementation Sequence

1. Verify the baseline and fix only blockers that prevent implementation or validation.
2. Add `searchQuery`, an accessible search input, and the title-only `visibleTasks` derivation in `App.jsx`.
3. Update list rendering and empty-state conditions.
4. Apply search styling and confirm existing add/edit/delete reload flows remain intact.
5. Add Playwright acceptance coverage for title matching, case, no matches, clearing/order, and network requests.
6. Run frontend build, backend integration tests, and browser tests.
7. Add or update CI steps and perform final release validation.
