---
name: 08-pr-writer
description: >-
  Generates src/docs/pr-description.md with all 5 required sections, updates
  CHANGELOG.md, commits/pushes changes, and creates the Pull Request against
  main.
---

## Purpose

Execute Step 8 (PR Using Agentic SDLC) by generating `src/docs/pr-description.md`, adding a changelog entry to `CHANGELOG.md`, and creating a Pull Request from `feature/auto-search` into `main`.

---

## Preconditions

1. `src/docs/review-report.md` must exist and must NOT have an assessment of `Additional Changes Required`.
2. `src/docs/verification-report.md` must exist with actual passing test evidence.
If either prerequisite is missing, stop immediately and tell the user which earlier step to run first.

---

## Instructions

1. Read `src/docs/requirements.md`, `src/docs/impl-done.md`, `src/docs/review-report.md`, and `src/docs/verification-report.md`.
2. Inspect the branch diff (`git diff --stat main...HEAD`) to list all added/modified files accurately.
3. Generate `src/docs/pr-description.md` using the mandatory 5-section template below.
4. Create or update `CHANGELOG.md` at the repository root with a concise entry for the Task Manager auto-search feature.
5. Present a concise summary of the PR title, target branch (`main`), `src/docs/pr-description.md`, and `CHANGELOG.md`, and ask **one single approval question** before committing, pushing, or opening the PR.
6. After explicit user approval:
   - Stage and commit `src/docs/pr-description.md` and `CHANGELOG.md`.
   - Push `feature/auto-search` to `origin`.
   - Create the Pull Request against `main` using `gh pr create --base main --head feature/auto-search --title "<PR Title>" --body-file src/docs/pr-description.md` (if `gh` CLI is not authenticated, report the exact status and provide the direct GitHub Compare/PR URL).
   - Never merge the PR automatically.

---

## Mandatory Pull Request Template (`src/docs/pr-description.md`)

# Pull Request: Task Manager Auto-Search Feature

## Summary
Provide a 2–3 sentence overview describing what was built, why it was needed, and its impact.

## Changes Made
Bulleted list of all key files added or modified and the reason for each change.

## Test Evidence
Paste actual command outputs and pass counts directly from `src/docs/verification-report.md` (backend unit/integration tests, Playwright browser tests, frontend build, and live health checks).

## Known Limitations
List anything marked 'Not Found' or out of scope (e.g., legacy `test:bdd` script configuration, client-side title-only filtering by design).

## Reviewer Checklist
- [ ] Implementation matches `src/docs/requirements.md` and `src/docs/architecture.md`
- [ ] All backend and Playwright automated tests pass
- [ ] Frontend build succeeds with zero errors
- [ ] No unintended backend, SQLite, or API modifications
- [ ] Code review findings in `src/docs/review-report.md` addressed
- [ ] `CHANGELOG.md` updated