# Defect 4: Employee Table Lacks Search, Sort, and Filter Functionality

## Severity
**Low**

## Component
- Benefits Dashboard — Employee Table

## Description
The employee table does not provide any search, sort, or filter capabilities. Users have no way to quickly locate a specific employee or organize the table by a particular column (e.g., Last Name, Salary, Benefits Cost).

## Steps to Reproduce
1. Log in to the Benefits Dashboard.
2. Observe the employee table.
3. Attempt to search for an employee by name — no search field is available.
4. Attempt to click on a column header to sort — no sorting behavior occurs.
5. Attempt to filter by any criteria — no filter controls are available.

## Expected Result
The employee table should provide basic data table functionality:
- **Search** — A text input to filter the table by employee name or other fields.
- **Sort** — Clickable column headers to sort ascending/descending by that column.
- **Filter** — Optional filtering by specific criteria (e.g., dependants count range).

## Actual Result
None of these features are available. The table is a static, unordered list.

## Impact
- Significantly degrades usability as the number of employees grows.
- Users must manually scan the entire table to find a specific employee.
- These are standard features expected in any data table component.

## Notes
- While this may not be in the current acceptance criteria, search/sort/filter are considered baseline table features. Consult with Product Manager on priority and scope.
