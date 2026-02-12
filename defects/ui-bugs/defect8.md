# Defect 8: Update Employee Does Not Persist Dependants Change

## Severity
**High**

## Component
- Edit Employee Modal / Update Employee API

## Description
When editing an existing employee and changing the **Dependants** field, the update does not persist. After clicking "Update" and the modal closes, the employee row in the table still shows the **original** dependants value. The benefits cost and net pay are also not recalculated.

## Steps to Reproduce
1. Log in to the Benefits Dashboard with valid credentials.
2. Add a new employee with **1 dependant**.
3. Click the **Edit** (pencil) icon on that employee's row.
4. In the Edit modal, change the **Dependants** field from `1` to `5`.
5. Click **Update**.
6. Observe the employee row in the table.

## Expected Result
- The Dependants column should show `5`.
- The Benefits Cost should be recalculated to reflect 5 dependants: `$134.62/paycheck` (1000 + 5×500 = 3500/year → 3500/26 ≈ 134.62).
- The Net Pay should be updated accordingly.

## Actual Result
- The Dependants column still shows `1` (the original value).
- Benefits Cost and Net Pay remain unchanged — the update was not saved.

## Impact
- **Critical functionality issue** — editing employee dependants is a core feature of the Benefits Dashboard.
- Benefits calculations will be incorrect if dependants cannot be updated.
- Users have no indication that the update failed — the modal closes as if the operation succeeded.

## Notes
- The modal closes successfully after clicking "Update", suggesting the UI flow completes but the API call may not be sending the updated dependants value, or the table is not refreshed after the update.
- This may also affect updates to First Name and Last Name fields — further investigation needed.
- Related to the column swap bug (defect7): the swapped First Name / Last Name columns in the table may cause the edit modal's pre-fill logic to read incorrect cell positions, potentially sending wrong data in the PUT request.
