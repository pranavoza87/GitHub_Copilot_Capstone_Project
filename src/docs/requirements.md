# Task Manager Auto-Search Requirements

## Scope and overview

Add an auto-search field to the Task Manager UI. As the user types, the UI filters the tasks already loaded from `GET /api/tasks` and immediately shows only tasks whose title contains the search term. Clearing the field restores the full loaded list.

## Assumptions

- Search is performed client-side on the currently loaded task set; it does not fetch more tasks.
- Matching is a case-insensitive substring match. Search text is used as entered; leading and trailing whitespace are not removed.
- A task matches if its title contains the search term.
- An empty search term matches every currently loaded task.
- No accessibility standard or quantitative response-time target was supplied; the search field will have an accessible label and update without an intentional delay.

## Functional requirements

- **FR-1:** The UI shall provide a task search field alongside the loaded tasks list.
- **FR-2:** On each search-field change, the UI shall immediately filter the currently loaded tasks without waiting for a submit action.
- **FR-3:** A task shall match when its title contains the entered search term, using case-insensitive substring matching.
- **FR-4:** The UI shall show only matching tasks while the search term is non-empty. If no tasks match, the task list shall contain no task rows and shall not show a separate no-results message.
- **FR-5:** When the search field is cleared, the UI shall show all tasks from the currently loaded task set again.
- **FR-6:** Filtering shall not alter task data or issue an additional API request.

## Non-functional requirements

- **NFR-1:** Search updates shall be immediate from the user's perspective, with no intentional debounce delay or server round trip.
- **NFR-2:** The search field shall have an accessible label that identifies it as the task search field.
- **NFR-3:** Applying or clearing a search shall preserve the original loaded tasks and the existing order of matching tasks.

## Acceptance criteria

### AC-1: Filter by title as the user types

**Given** the loaded tasks are “Write quarterly report”, “Book flights”, and “Pay invoices”  
**When** the user types “book” into the task search field  
**Then** only “Book flights” is shown  
**And** the list updates without a submit action or additional API request.

### AC-2: Match without regard to case

**Given** a loaded task has “Book flights” as its title  
**When** the user searches for “BOOK”  
**Then** “Book flights” is shown.

### AC-3: Show an empty list when there are no matches

**Given** tasks are loaded  
**When** the user enters a term that appears in no task title  
**Then** no task rows are shown  
**And** no separate no-results message is shown.

### AC-4: Clear the search

**Given** the search field has filtered the three tasks from AC-1  
**When** the user clears the search field  
**Then** all three loaded tasks are shown again in their existing order.

## Out of scope

- Server-side, database, or API search and changes to `GET /api/tasks`.
- Loading tasks beyond the set already loaded in the UI.
- Changing, sorting, or otherwise modifying task data as a result of searching.
- Search by fields other than task title.
- Description storage, description API fields, and description-based matching.

## Source

User-provided story text for Jira issue EPMCDMETST-72912. The Jira issue could not be fetched because no Jira MCP tool was available in this session; the supplied fallback story text was used. Search-field behavior was clarified with the user.
