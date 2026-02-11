# Defect 4: GET /api/Employees/{id} Returns 200 for Deleted Employee

## Severity
**High**

## Endpoint
- `GET /api/Employees/{id}`

## Description
After successfully deleting an employee via `DELETE /api/Employees/{id}` (which returns 200), a subsequent `GET /api/Employees/{id}` for the same ID still returns HTTP 200 instead of 404. The deleted employee remains retrievable by ID.

## Steps to Reproduce
1. Create an employee via `POST /api/Employees`.
2. Delete the employee via `DELETE /api/Employees/{id}` — returns 200.
3. Fetch the employee via `GET /api/Employees/{id}`.

## Expected Result
`GET /api/Employees/{id}` should return `404 Not Found` because the employee has been deleted.

## Actual Result
`GET /api/Employees/{id}` returns `200 OK` with the employee data, as if the deletion never occurred.

## Impact
- The delete operation appears to succeed (returns 200) but the resource is still accessible.
- This breaks the expected REST semantics for resource deletion.
- Note: The employee IS removed from the list endpoint (`GET /api/Employees`), so the deletion is partially effective.

## Affected Tests
- `test_delete_employee_not_retrievable_by_id`
- `test_full_crud_lifecycle` (Step 7)
