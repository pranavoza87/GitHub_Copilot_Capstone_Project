# Task Manager Auto-Search Requirements

## Functional Requirements

- **FR-1:** The UI shall provide a search field for filtering tasks currently loaded from `GET /api/tasks`.
- **FR-2:** As the user types, the UI shall immediately show only loaded tasks whose titles contain the search term. Matching shall be case-insensitive and support partial text. For example, searching `book` shall show **Book flights**.
- **FR-3:** The UI shall not use a debounce delay. It shall update the displayed task list as each search-term change is received.
- **FR-4:** If no loaded tasks match the search term, the UI shall display: **“No matching tasks found.”**
- **FR-5:** When the user clears the search field, the UI shall display all originally loaded tasks again.
- **FR-6:** Searching shall filter tasks already loaded in the UI and shall not require another API request.

## Non-Functional Requirements

- **NFR-1:** Search results shall update immediately after each user input, without an intentional debounce delay or server round trip.
- **NFR-2:** The search field shall have an accessible label identifying its purpose.
- **NFR-3:** The no-results message shall be clearly visible and readable when no tasks match.
- **NFR-4:** Applying or clearing a search shall not alter the underlying loaded tasks; clearing the search term shall restore the full list.