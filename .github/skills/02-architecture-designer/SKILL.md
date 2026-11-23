---
name: 02-architecture-designer
description: >-
  Creates a structured system architecture document (src/docs/architecture.md)
  aligned to src/docs/requirements.md and the existing repository structure,
  including a Mermaid component diagram, data flow, and state/error handling.
---

## Purpose

Design the high-level system architecture based on `src/docs/requirements.md` and the existing codebase in `Task_Manager_App/`.

This skill is responsible for:
- Analyzing `src/docs/requirements.md`
- Inspecting the existing repository structure (`Task_Manager_App/`)
- Identifying affected and new system components and their responsibilities
- Proposing technology choices with clear rationale
- Defining end-to-end data flow
- Documenting state, error handling, and security/dependency assertions
- Generating a Mermaid component diagram
- Producing `src/docs/architecture.md`

---

## Inputs (Mandatory)

- `src/docs/requirements.md`
- Current code structure under `Task_Manager_App/`

If `src/docs/requirements.md` is missing, halt immediately and instruct the user to complete Step 1 (Requirements) first.

---

## Workflow

### Step 1: Review Requirements
Read `src/docs/requirements.md` thoroughly. Identify:
- Functional requirements
- Non-functional requirements
- Assumptions & out-of-scope items
- Acceptance criteria (Given/When/Then)

Highlight security, performance, scalability, and extensibility considerations.

### Step 2: Architecture Analysis
Inspect `Task_Manager_App/` and determine:
- Application type and existing patterns
- Major capabilities and system boundaries
- External dependencies (assert no unapproved third-party libraries)
- Key architectural decisions (e.g., client-side filtering vs. server-side queries)

### Step 3: Identify Components
List all affected and new components in a Markdown table with:
- Component Name & File Path
- Purpose
- Responsibilities
- Interactions

### Step 4: Technology Recommendation
Document technology choices in a Markdown table covering:
- Frontend
- Backend (note if unchanged)
- Database (note if unchanged)
- Testing
- Build Tools

Explain why each choice aligns with the existing stack and requirements.

### Step 5: Generate Data Flow
Describe the end-to-end flow using numbered steps:
1. Initial data load (if applicable)
2. User action (e.g., typing or clearing the search input)
3. Frontend state/filtering logic
4. Backend/API interaction (explicitly note if zero additional API calls occur)
5. UI re-render / response flow

### Step 6: State, Error Handling & Security Assertions
Explicitly document:
- **Positive (Happy Path):** Valid search queries and expected matches.
- **Negative (Error Path):** Null/undefined task fields, malformed data, or failed initial `GET /api/tasks` fetch.
- **False / Empty State:** Blank search query (restores full list) and zero matching results.
- **Security & Dependency Safety:** Input handling/sanitization (React XSS safety) and zero new vulnerable packages.

### Step 7: Generate Component Diagram
Include a valid Mermaid component diagram (`graph TD` or `flowchart TD`) illustrating the user, UI components, state/filtering flow, and existing API boundary.

---

## Output
- Final, well-formed Markdown written to `src/docs/architecture.md` with no conversational filler.