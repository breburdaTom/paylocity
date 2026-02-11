# Defect 3: API Does Not Enforce `maxLength` Validation on `username` Field

## Severity
**Medium**

## Endpoint
- `POST /api/Employees`

## Description
The OpenAPI spec defines `username` with `maxLength: 50`. However, the API accepts a username with 51 characters and returns HTTP 200 instead of rejecting it with a 400 validation error.

## Steps to Reproduce
1. Send `POST /api/Employees` with a username of 51 characters:
   ```json
   {
     "username": "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
     "firstName": "John",
     "lastName": "Adams",
     "dependants": 0,
     "salary": 52000.0
   }
   ```
2. Observe the response status code.

## Expected Result
The API should return `400 Bad Request` because the `username` exceeds the maximum length of 50 characters.

## Actual Result
The API returns `200 OK` and creates the employee.

## Spec Reference
```json
"username": {
  "maxLength": 50,
  "minLength": 0,
  "type": "string"
}
```

## Impact
- Violates the OpenAPI contract's `maxLength` constraint.
- Could lead to data truncation or storage issues downstream.

## Affected Tests
- `test_create_employee_username_exceeds_max_length`
