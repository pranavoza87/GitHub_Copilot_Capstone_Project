---
name: 04-impl-planner
description: >-
  Breaks approved architecture (src/docs/architecture.md), requirements
  (src/docs/requirements.md), and design review decisions
  (src/docs/design-review.md) into a prioritized, dependency-ordered
  implementation plan in src/docs/impl-plan.md.
---

## Purpose

Create a prioritized and dependency-ordered implementation plan based on the approved architecture and design review decisions.

This skill is responsible for:
- Reading `src/docs/architecture.md`, `src/docs/requirements.md`, and `src/docs/design-review.md`
- Inspecting the existing codebase under `Task_Manager_App/` for accurate file-level mapping
- Identifying all implementation and verification/testing tasks (including Playwright and empty/error-state coverage)
- Breaking work into small, single-responsibility, testable deliverable units
- Defining task dependencies, parallel work opportunities, and blocked tasks
- Assigning priorities (P1–P4) and grouping tasks into milestones
- Creating `src/docs/impl-plan.md`

---

## Inputs

**Required (Mandatory):**
- `src/docs/requirements.md`
- `src/docs/architecture.md`

**Recommended:**
- `src/docs/design-review.md`
- Existing codebase under `Task_Manager_App/`

---

## Preconditions

Before planning begins:
1. `src/docs/architecture.md` must exist. If missing, halt and instruct the user to complete Step 2 (Architecture) first.

---

## Workflow

### Step 1: Analyze Architecture & Design Review
Review components, state/data flow, API boundaries (confirming no backend/DB changes if decided), security/error-handling requirements, and testing priorities from `src/docs/design-review.md`.

### Step 2: Create Task Breakdown
Break implementation into small, testable tasks (one responsibility per task), mapped to exact target files under `Task_Manager_App/`.

### Step 3: Define Dependencies
Determine the exact execution order from foundation to UI implementation to automated verification/Playwright tests.

### Step 4: Identify Parallel Work
Document any tasks or workstreams that can proceed simultaneously.

### Step 5: Identify Blocked Tasks
For every task with prerequisites, explicitly document what blocks it in a Markdown table (`Task | Blocked By | Status`).

### Step 6: Prioritize Tasks
Assign priority levels:
- **P1:** Critical Foundation
- **P2:** Core Features
- **P3:** Supporting Features & Automated Tests
- **P4:** Nice-to-Have Enhancements

### Step 7: Generate Milestones
Group tasks into logical milestones (e.g., Foundation, Core UI Filtering, Error/Empty-State Handling, Verification & Playwright Testing, Release Readiness).

### Step 8: Generate `src/docs/impl-plan.md`
Write well-formed Markdown (no conversational filler) using this structure:
- `# Implementation Plan`
- `## Overview`
- `## Assumptions`
- `## Task Breakdown` (each task with Description, Target Files, Priority, Dependencies, Deliverable)
- `## Dependency Order` (numbered list)
- `## Parallel Work Opportunities`
- `## Blocked Tasks` (Markdown table: `Task | Blocked By | Status`)
- `## Milestones`
- `## Risks` (Risk & Mitigation)
- `## Suggested Implementation Sequence`

---

## Rules

- Do NOT generate source code.
- Do NOT generate test code.
- Do NOT perform implementation or modify files in `Task_Manager_App/`.
- Focus strictly on planning.
- Keep tasks small, dependency-ordered, and explicitly mapped back to `src/docs/architecture.md` and `src/docs/design-review.md`.