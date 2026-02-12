# Defect 1: API Ignores `username` Field — Value Not Stored or Returned Correctly

## Severity
**High**

## Endpoint
- `POST /api/Employees`
- `PUT /api/Employees`
- `GET /api/Employees/{id}`

## Description
When creating or updating an employee, the `username` field sent in the request body is ignored by the API. Instead of storing and returning the provided username, the API assigns a default/auto-generated value (e.g., `TestUser884`).

## Steps to Reproduce
1. Send `POST /api/Employees` with the following body:
   ```json
   {
     "username": "willisdylan",
     "firstName": "Kimberly",
     "lastName": "Williams",
     "dependants": 0,
     "salary": 52000.0
   }
   ```
2. Observe the response body.

## Expected Result
The response should contain `"username": "willisdylan"` — the same value that was sent in the request.

## Actual Result
The response contains `"username": "TestUser884"` — a different, auto-generated value. The provided username is silently discarded.

## Impact
- The `username` field is defined as **required** in the OpenAPI spec with `maxLength: 50` and `minLength: 0`.
- The API accepts the field without error but does not persist the provided value.
- This affects create, update, and read operations — the username is never the value the client intended.

## Affected Tests
- `test_create_employee_returns_employee_data`
- `test_create_employee_retrievable_by_id`
- `test_update_employee_username`
- `test_get_employee_by_id_returns_correct_data`
- `test_full_crud_lifecycle`
