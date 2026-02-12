# Defect 1: First Name and Last Name Fields Accept Invalid Characters

## Severity
**Medium**

## Component
- Add Employee Modal — `First Name` and `Last Name` input fields

## Description
When adding a new employee, the First Name and Last Name input fields accept and save invalid characters (e.g., numbers, special characters). There is no client-side or server-side validation preventing non-alphabetic input in name fields.

## Steps to Reproduce
1. Log in to the Benefits Dashboard.
2. Click **Add Employee**.
3. Enter invalid characters (e.g., `J0hn!`, `123`, `@#$%`) in the **First Name** or **Last Name** fields.
4. Fill in the remaining required fields with valid data.
5. Click **Add**.

## Expected Result
The form should reject non-alphabetic characters in the First Name and Last Name fields. Validation can be implemented either:
- **On input level** — preventing invalid characters from being typed, or
- **On submit level** — showing a validation error when the Add button is clicked.

## Actual Result
Invalid characters are accepted, and the employee record is created with the malformed name data.

![Screenshot](image.png)

## Impact
- Data integrity issue — employee names can contain numbers and special characters.
- May cause downstream issues in payroll processing, reports, or integrations that expect alphabetic names.

## Notes
- Developer should choose between input-level or submit-level validation based on UX guidelines.
