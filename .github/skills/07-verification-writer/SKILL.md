---
name: 07-verification-writer
description: >-
  Runs the comprehensive verification suite (backend unit/integration tests,
  Playwright browser tests, frontend build, application health check, and SDLC
  documentation quality check) and writes src/docs/verification-report.md.
---

## Purpose

Validate solution readiness for Step 7 (Verify) by:
- Reviewing and addressing any test-coverage gaps flagged in `src/docs/review-report.md` (if needed)
- Executing all backend unit/integration tests and Playwright browser tests
- Running the frontend production build
- Verifying application startup and key endpoints
- Performing a content quality check across the SDLC documentation in `src/docs/`
- Generating `src/docs/verification-report.md` with actual execution results

---

## Inputs

**Required (Mandatory):**
- `src/docs/review-report.md`
- `src/docs/impl-done.md`
- `src/docs/requirements.md`
- Implemented application and tests under `Task_Manager_App/`

---

## Preconditions

1. `src/docs/review-report.md` must exist. If it is missing, stop immediately and instruct the user to complete Step 6 (Code Review) first.

---

## Responsibilities

### 1. Review Gap Check & Playwright Coverage
- Check `src/docs/review-report.md` for any Medium/Low test-coverage gaps (e.g., mutation-refresh or edge-case coverage).
- Add targeted Playwright tests under `Task_Manager_App/tests/` if needed to close those gaps, covering Positive, Negative, and Boundary scenarios.

### 2. Execute Automated Tests & Build
Run the actual commands in `Task_Manager_App/` (never simulate output):
- Frontend build (e.g., `npm run build` in `Task_Manager_App/frontend`)
- Backend unit/integration test suite (e.g., `npm test` in `Task_Manager_App/backend`)
- Playwright browser test suite (e.g., `npm run test:search --prefix Task_Manager_App`)

### 3. Application Health Check
Verify the application starts cleanly with no critical errors and that key endpoints respond as expected:
- Frontend root (`GET /`)
- Backend tasks endpoint (`GET /api/tasks` or configured health/tasks route)

### 4. Output Document Quality Check
Verify that all SDLC artifacts in `src/docs/` (`requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `impl-done.md`, `review-report.md`) are present, complete, internally consistent, and free of placeholder text.

### 5. Failure Handling
If any check fails:
- Record the exact error output
- Explain the probable root cause
- Recommend or apply a targeted fix and re-run
- Never silently skip a failed check

---

## Output

Write well-formed Markdown to `src/docs/verification-report.md` using this exact structure:

# Verification Report

## Requirement Verified
Brief summary of the verified auto-search functionality against `src/docs/requirements.md`.

## Playwright Tests
- Existing Tests
- Added/Updated Tests (if any)
- Positive Scenarios
- Negative Scenarios
- Boundary Scenarios

## Application Health Check
- Startup Status
- Key Endpoint Results (`GET /`, backend tasks API)

## Backend Unit & Integration Test Results
Command Executed:
Total:
Passed:
Failed:
Skipped:

## Playwright Test Results
Command Executed:
Total:
Passed:
Failed:
Skipped:

## Frontend Build Verification
Command Executed:
Status:

## Documentation Quality Check
- `src/docs/requirements.md`: Pass / Issues
- `src/docs/architecture.md`: Pass / Issues
- `src/docs/design-review.md`: Pass / Issues
- `src/docs/impl-plan.md`: Pass / Issues
- `src/docs/impl-done.md`: Pass / Issues
- `src/docs/review-report.md`: Pass / Issues

## Verification Summary
- Requirement verified: Yes / No
- Automated tests executed & passing: Yes / No
- Application health verified: Yes / No
- Documentation quality verified: Yes / No
- Ready for Step 8 (PR Creation): Yes / No