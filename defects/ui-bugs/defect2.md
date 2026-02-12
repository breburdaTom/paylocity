# Defect 2: Employee Table Displays Records in Random Order

## Severity
**Low**

## Component
- Benefits Dashboard — Employee Table

## Description
Employees added to the dashboard appear in an unpredictable, seemingly random order in the table. There is no consistent sorting applied to the employee list, making it difficult for users to locate specific records as the list grows.

## Steps to Reproduce
1. Log in to the Benefits Dashboard.
2. Add multiple employees (e.g., 5+).
3. Observe the order of records in the employee table.
4. Refresh the page and observe the order again.

## Expected Result
Records should be displayed in a consistent, predictable order based on a logical sorting rule, such as:
- Alphabetical order by **Last Name** (most common for employee directories)
- Chronological order by **creation date** (newest first or oldest first)

## Actual Result
Records appear in a random or inconsistent order that changes unpredictably.

## Impact
- Poor user experience — users cannot easily find employees in the table.
- Becomes increasingly problematic as the number of employees grows.

## Notes
- Consult with UX Designer / Product Manager to determine the preferred default sort order.
- Consider also implementing column-header sorting (see Defect 4).
