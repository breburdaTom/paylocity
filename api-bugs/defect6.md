# Defect 6: GET /api/Employees/{id} Returns 200 for Non-Existent UUID

## Severity
**Medium**

## Endpoint
- `GET /api/Employees/{id}`

## Description
When requesting an employee by a valid UUID format that does not exist in the system, the API returns HTTP 200 instead of 404.

## Steps to Reproduce
1. Generate a random UUID (e.g., `70849d71-f38d-4324-a988-db7429ed8b9f`).
2. Send `GET /api/Employees/70849d71-f38d-4324-a988-db7429ed8b9f`.
3. Observe the response.

## Expected Result
The API should return `404 Not Found` since no employee exists with that ID.

## Actual Result
The API returns `200 OK`.

## Impact
- Clients cannot determine whether an employee exists by checking the status code.
- Violates standard REST conventions where a missing resource should return 404.

## Affected Tests
- `test_get_employee_by_nonexistent_id_returns_404`
