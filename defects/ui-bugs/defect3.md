# Defect 3: Duplicate Employee Records Can Be Created

## Severity
**Medium**

## Component
- Add Employee Modal / Employee API

## Description
The system allows users to create multiple employee records with identical First Name and Last Name combinations. There is no uniqueness validation to prevent duplicate entries, which can lead to data integrity issues and confusion.

## Steps to Reproduce
1. Log in to the Benefits Dashboard.
2. Click **Add Employee**.
3. Enter `First Name: John`, `Last Name: Doe`, and valid values for other fields.
4. Click **Add** — employee is created successfully.
5. Click **Add Employee** again.
6. Enter the same `First Name: John`, `Last Name: Doe` with the same or different other fields.
7. Click **Add** — a second identical record is created.

## Expected Result
The system should prevent creation of duplicate employee records. When a user attempts to add an employee with a First Name + Last Name combination that already exists, the system should:
- Display a validation error (e.g., *"An employee with this name already exists"*), or
- Prompt the user to confirm the addition if it's intentional.

## Actual Result
Duplicate records are created without any warning or validation.

## Impact
- Data integrity issue — multiple records for the same person can cause payroll errors.
- Confusion when editing or deleting — users may modify the wrong record.

## Notes
- In real-world scenarios, two employees can share the same full name. If this is a valid use case, the form should include an additional distinguishing field (e.g., **Date of Birth**, **Employee ID**, or **Email**) to differentiate records.
- Consult with Product Manager on the desired uniqueness constraint.
