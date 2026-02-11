# Defect 2: API Does Not Validate `username` as a Required Field

## Severity
**High**

## Endpoint
- `POST /api/Employees`
- `PUT /api/Employees`

## Description
The OpenAPI spec defines `username` as a **required** field in the Employee schema. However, the API accepts requests without the `username` field and returns HTTP 200 (success) instead of a 400 validation error.

## Steps to Reproduce
1. Send `POST /api/Employees` with the following body (no `username`):
   ```json
   {
     "firstName": "John",
     "lastName": "Doe"
   }
   ```
2. Observe the response status code.

## Expected Result
The API should return `400 Bad Request` because the required `username` field is missing.

## Actual Result
The API returns `200 OK` and creates the employee without a username (or with an auto-generated one).

## Spec Reference
```json
"required": ["firstName", "lastName", "username"]
```

## Impact
- Violates the OpenAPI contract which marks `username` as required.
- Allows creation of employees without a username, leading to data integrity issues.

## Affected Tests
- `test_create_employee_missing_required_username`
- `test_update_employee_missing_required_username`
