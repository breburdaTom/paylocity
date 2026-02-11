# Defect 7: PUT /api/Employees Returns 200 for Non-Existent Employee ID

## Severity
**Medium**

## Endpoint
- `PUT /api/Employees`

## Description
When sending a PUT request with a valid UUID that does not correspond to any existing employee, the API returns HTTP 200 instead of 404. This means the API silently accepts updates for non-existent resources.

## Steps to Reproduce
1. Generate a random UUID (e.g., `840c716e-7974-4d8c-9e53-9b71edba8c6d`).
2. Send `PUT /api/Employees` with body:
   ```json
   {
     "id": "840c716e-7974-4d8c-9e53-9b71edba8c6d",
     "username": "joseph33",
     "firstName": "Melissa",
     "lastName": "Foley",
     "dependants": 0,
     "salary": 52000.0
   }
   ```
3. Observe the response.

## Expected Result
The API should return `404 Not Found` since no employee exists with that ID.

## Actual Result
The API returns `200 OK`. It is unclear whether a new employee is created (upsert behavior) or the request is silently ignored.

## Impact
- Clients cannot distinguish between a successful update and a no-op.
- May lead to data inconsistency if the API performs an upsert instead of a strict update.

## Affected Tests
- `test_update_nonexistent_employee`
