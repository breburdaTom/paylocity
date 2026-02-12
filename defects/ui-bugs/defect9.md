# Defect 9: Employee Table Displays Rows with "null null" Names

## Severity
**Medium**

## Component
- Benefits Dashboard — Employee Table

## Description
The employee table contains rows where the First Name and Last Name columns display the literal text `null`. This occurs when employees are created via the API (or UI) without providing name values — the API accepts the request (see api-bugs/defect8) and the UI renders the missing values as `null` instead of handling them gracefully.

## Steps to Reproduce
1. Send `POST /api/Employees` with an empty or partial body (e.g., `{}`).
2. Log in to the Benefits Dashboard.
3. Observe the employee table — a row appears with `null null` as the name.

## Expected Result
- The API should reject requests with missing required fields (separate defect).
- If such records exist in the database, the UI should either:
  - Display a placeholder (e.g., `—` or `N/A`) instead of `null`, or
  - Filter out invalid records from the table.

## Actual Result
The table displays the raw string `null` in the First Name and Last Name columns, which is confusing and looks like a broken application.

## Impact
- Poor user experience — `null` is a technical artifact that should never be shown to end users.
- Users cannot meaningfully interact with these rows (edit/delete by name is unreliable).

## Notes
- Root cause is the API accepting empty payloads (api-bugs/defect8). This UI defect is about the display layer not handling the bad data gracefully.
