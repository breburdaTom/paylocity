# Defect 8: API Does Not Validate Required Fields or Enforce Constraints on firstName, lastName, and dependants

## Severity
**High**

## Endpoint
- `POST /api/Employees`
- `PUT /api/Employees`

## Description
The API accepts invalid input across multiple fields without returning validation errors. According to the OpenAPI spec, `firstName` and `lastName` are required fields with `maxLength: 50`, and `dependants` has a valid range of `0–32`. However, the API returns 200 for all of the following invalid payloads.

## Failing Scenarios

### 1. Missing required `firstName`
```json
{ "username": "testuser", "lastName": "Doe" }
```
**Expected:** 400  **Actual:** 200

### 2. Missing required `lastName`
```json
{ "username": "testuser", "firstName": "John" }
```
**Expected:** 400  **Actual:** 200

### 3. Empty body
```json
{}
```
**Expected:** 400  **Actual:** 200 (creates employee with `null` name fields)

### 4. `firstName` exceeds maxLength (51 chars)
```json
{ "username": "test", "firstName": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "lastName": "Doe" }
```
**Expected:** 400  **Actual:** 200

### 5. `lastName` exceeds maxLength (51 chars)
Same pattern — accepted without error.

### 6. Negative dependants
```json
{ "username": "test", "firstName": "John", "lastName": "Doe", "dependants": -1 }
```
**Expected:** 400  **Actual:** 200

### 7. Dependants exceeds maximum (33)
```json
{ "username": "test", "firstName": "John", "lastName": "Doe", "dependants": 33 }
```
**Expected:** 400  **Actual:** 200

## Spec Reference
```json
"firstName": { "maxLength": 50, "minLength": 0, "type": "string" }
"lastName":  { "maxLength": 50, "minLength": 0, "type": "string" }
"dependants": { "format": "int32", "maximum": 32, "minimum": 0, "type": "integer" }
```

All three fields are listed under `"required"` in the Employee schema.

## Impact
- Employees can be created with `null` names, negative dependants, or names exceeding storage limits.
- This is visible in the UI — the employee table shows rows with `null null` as the name.
- Benefits calculations may produce incorrect results for out-of-range dependants values.

## Notes
- This is related to but distinct from defects 2 and 3 which cover `username` validation specifically.
- The same validation gaps exist on the PUT endpoint.
