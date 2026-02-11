# Defect 5: DELETE /api/Employees/{id} Returns 200 for Non-Existent and Already-Deleted Employees

## Severity
**Medium**

## Endpoint
- `DELETE /api/Employees/{id}`

## Description
The `DELETE /api/Employees/{id}` endpoint returns HTTP 200 (success) even when:
1. The provided UUID does not correspond to any existing employee.
2. The employee has already been deleted.

The API should return 404 to indicate the resource was not found.

## Steps to Reproduce

### Scenario 1: Non-existent employee
1. Generate a random UUID that does not belong to any employee.
2. Send `DELETE /api/Employees/{random-uuid}`.
3. Observe the response.

### Scenario 2: Already-deleted employee
1. Create an employee and note the ID.
2. Delete the employee — returns 200.
3. Delete the same employee again.
4. Observe the response.

## Expected Result
Both scenarios should return `404 Not Found`.

## Actual Result
Both scenarios return `200 OK`.

## Impact
- Clients cannot distinguish between a successful deletion and a no-op on a non-existent resource.
- Violates REST best practices where DELETE on a non-existent resource should return 404.

## Affected Tests
- `test_delete_nonexistent_employee_returns_404`
- `test_delete_already_deleted_employee`
