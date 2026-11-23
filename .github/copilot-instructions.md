# Copilot Instructions

## Project context
- This repository contains the **Task Manager Application** (`Task_Manager_App/`) built with a React + Vite frontend (`Task_Manager_App/frontend/`), a Node.js + SQLite backend (`Task_Manager_App/backend/`), and Playwright automated browser tests (`Task_Manager_App/tests/`).
- Use the `src/docs/` folder for generated SDLC artifacts: `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `impl-done.md`, `review-report.md`, `verification-report.md`, and `pr-description.md`.

## Repository rules
- Keep changes small, focused, and reviewable.
- Prefer the simplest implementation that satisfies the requirement.
- Validate inputs at boundaries and handle errors consistently.
- Avoid unnecessary dependencies or framework churn.
- Do not add secrets, credentials, or sensitive configuration values to the repo.
- Do not commit generated artifacts (`node_modules/`, `dist/`, `test-results/`, `playwright-report/`).
- Update SDLC documentation when requirements, architecture, or implementation decisions change.
- Prefer existing project patterns over introducing new structure or abstractions.

## Coding expectations
- Maintain a clear separation between backend API/database behavior (`Task_Manager_App/backend/`) and frontend UI logic (`Task_Manager_App/frontend/`).
- Keep UI changes in the existing React components and stylesheets unless the requirement explicitly demands new libraries or abstractions.
- Prefer testable code and add automated tests (backend unit/integration and Playwright browser tests) for non-trivial logic and user-facing behavior.
- If a feature changes behavior, update the relevant documentation and artifacts in `src/docs/`.

## SDLC guidance
- The structured SDLC workflow is implemented as one master orchestrator (`sdlc-agent`) plus eight dedicated phase agents in `.github/agents/`, each pairing 1:1 with a skill in `.github/skills/`:

  | Phase | Agent | Skill |
  | :--- | :--- | :--- |
  | 1. Requirements | `01-requirements-agent` | `01-requirements-clarifier` |
  | 2. Architecture | `02-architecture-agent` | `02-architecture-designer` |
  | 3. Design Review | `03-design-review-agent` | `03-design-reviewer` |
  | 4. Implementation Planning | `04-impl-planner-agent` | `04-impl-planner` |
  | 5. Implementation | `05-implementation-agent` | `05-implementation-driver` |
  | 6. Code Review | `06-code-review-agent` | `06-code-reviewer` |
  | 7. Verification | `07-verification-agent` | `07-verification-writer` |
  | 8. PR Creation | `08-pr-agent` | `08-pr-writer` |

- For the end-to-end SDLC flow, select or invoke `sdlc-agent`. It does not perform phase work itself — it delegates each phase to the matching phase agent above (via the `agent` tool) and gates progress on artifact preconditions and human approval, one phase at a time.
- For a single phase in isolation, the corresponding phase agent can also be selected directly.
- Artifact preconditions are additionally enforced by the `preToolUse` hook in `.github/hooks/sdlc-hitl.json` (`.github/hooks/scripts/guard_docs.py`).
- Each phase agent follows its paired skill for detailed procedure and output format; keep skill usage scoped to the active phase, and do not jump ahead before required artifacts and Human-in-the-Loop (HITL) approvals are complete.
- Treat skills as the domain knowledge/procedure for a phase, agents as the persona + tool access + delegation for that phase, and this file as project-wide standards that apply regardless of phase.

## Output preferences
- Provide Markdown ready to commit for docs.
- Provide code changes as diffs or full files when asked.
- When creating docs, use concise, implementation-ready language and include assumptions, trade-offs, and actual validation evidence.
- If a required external dependency or permission is unavailable, state the limitation clearly and continue with the safest fallback.