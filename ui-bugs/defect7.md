# Defect 7: First Name and Last Name Columns Are Swapped in the Employee Table

## Severity
**Medium**

## Component
- Benefits Dashboard — Employee Table

## Description
The employee table header displays columns in the order `Last Name | First Name`, but the JavaScript `loadTable()` function populates the row cells in the order `firstName | lastName`. This causes the data to appear under the wrong column headers — first names are shown under "Last Name" and vice versa.

## Steps to Reproduce
1. Log in to the Benefits Dashboard.
2. Observe the employee table.
3. Compare the column headers with the actual data in each column.

## Expected Result
The data in each column should match its header:
- Column 2 header "Last Name" should contain the employee's last name.
- Column 3 header "First Name" should contain the employee's first name.

## Actual Result
- Column 2 header says **"Last Name"** but displays the employee's **first name**.
- Column 3 header says **"First Name"** but displays the employee's **last name**.

## Root Cause
In the inline `loadTable()` JavaScript function, the cells are inserted as:
```javascript
row.insertCell().innerHTML = employee.firstName;  // inserted into column 2 ("Last Name" header)
row.insertCell().innerHTML = employee.lastName;   // inserted into column 3 ("First Name" header)
```

The insertion order does not match the header order.

## Impact
- Users see names under incorrect column headers, causing confusion.
- Any sorting or filtering by column would produce misleading results.
- Automated tests that rely on positional column data will read swapped values.

## Notes
- The fix should either swap the `insertCell` order in `loadTable()` to match the headers, or swap the header labels to match the data insertion order.
