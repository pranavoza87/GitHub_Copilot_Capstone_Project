---
name: 06-code-reviewer
description: >-
  Performs a structured 7-area peer code review of the implementation and
  automated tests in Task_Manager_App/ against src/docs/requirements.md and
  src/docs/impl-done.md, writing severity-classified findings to
  src/docs/review-report.md.
---

## Purpose

Perform a structured, peer-level code review of the implemented auto-search feature and its automated tests before Step 7 (Verification) and Step 8 (PR Creation), and generate `src/docs/review-report.md`.

---

## Inputs

**Required (Mandatory):**
- `src/docs/requirements.md`
- `src/docs/impl-done.md`
- Implemented source code under `Task_Manager_App/`
- Automated tests under `Task_Manager_App/tests/`

**Additional Context:**
- `src/docs/architecture.md`
- `src/docs/design-review.md`
- `src/docs/impl-plan.md`

---

## Preconditions

1. `src/docs/impl-done.md` must exist. If it is missing, stop immediately and instruct the user to complete Step 5 (Implementation) first.

---

## Review Areas (7-Point Checklist)

Evaluate every area below explicitly against the actual code and tests:

### 1. Correctness
- Does each component behave as specified in `src/docs/requirements.md` and `src/docs/design-review.md` (title-only immediate client-side filtering, case-insensitive, order preserved, zero backend/SQLite/API changes)?

### 2. Security
- Are secrets excluded from code and output?
- Is user input handled safely (no XSS, no unsafe HTML injection, no unvalidated query injection)?

### 3. Error Handling
- Are API failures, missing/null/non-string fields, empty task lists, and zero-match states handled gracefully?

### 4. Test Coverage
- Are automated tests present and runnable?
- Do tests cover the happy path AND the 'Not Found' / missing-field / whitespace / boundary edge cases?

### 5. Code Clarity
- Are function and variable names self-explanatory?
- Is the logic easy to follow and maintain without unnecessary complexity?

### 6. DRY Principle
- Is there duplicated logic that should be refactored into a shared helper/function?

### 7. Dependency Safety
- Are all dependencies appropriate and necessary?
- Are any known-vulnerable or unapproved runtime packages introduced?

---

## Review Rules

- Focus on concrete, actionable feedback tied to specific files and lines.
- Classify every finding as **High**, **Medium**, or **Low** priority.
- Recommend clear improvements where needed.
- Do **NOT** rewrite production code or test files unless explicitly requested by the user.
- Do **NOT** execute Step 7 verification or Step 8 PR creation.

---

## Output

Write well-formed Markdown (no conversational filler) to `src/docs/review-report.md` using this exact structure:

# Review Report

## Summary
Brief overall assessment of the implementation and alignment with `src/docs/requirements.md`.

## Findings

### High Priority
- Finding / Impact / Recommendation (or `None`)

### Medium Priority
- Finding / Impact / Recommendation (or `None`)

### Low Priority
- Finding / Impact / Recommendation (or `None`)

## Review Results

### Correctness
Pass / Issues Found — brief rationale

### Security
Pass / Issues Found — brief rationale

### Error Handling
Pass / Issues Found — brief rationale

### Test Coverage
Pass / Issues Found — brief rationale

### Code Clarity
Pass / Issues Found — brief rationale

### DRY Principle
Pass / Issues Found — brief rationale

### Dependency Safety
Pass / Issues Found — brief rationale

## Recommended Improvements
- Actionable improvement list (or `None`)

## Overall Assessment
Select one:
- Ready for PR
- Ready for PR with Minor Improvements
- Additional Changes Required