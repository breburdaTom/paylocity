# Defect 6: Invalid Login Credentials Result in HTTP 405 Error Page Instead of Inline Error Message

## Severity
**High**

## Component
- Login Page — Authentication error handling

## Description
When a user submits invalid credentials (wrong username, wrong password, or empty fields) on the login page, the application navigates to a page that returns an **HTTP 405 (Method Not Allowed)** error instead of staying on the login page and displaying a user-friendly validation error message.

## Steps to Reproduce
1. Navigate to the Benefits Dashboard login page.
2. Enter invalid credentials (e.g., username: `invalidUser`, password: `invalidPassword`).
3. Click **Log In**.

**Alternative reproduction with empty fields:**
1. Navigate to the login page.
2. Leave the **Username** field empty and enter a valid password (or vice versa).
3. Click **Log In**.

## Expected Result
The application should remain on the login page and display an inline error message (e.g., within the `.validation-summary-errors` element) indicating that the credentials are invalid or that required fields are missing.

## Actual Result
After submitting invalid credentials, the page navigates away from the login form and returns an **HTTP 405 (Method Not Allowed)** error. No validation error message is shown to the user, and the login page is no longer displayed.

## Impact
- **Poor user experience** — users receive a cryptic HTTP error instead of actionable feedback about their login attempt.
- Users have no indication of what went wrong and must manually navigate back to the login page.
- Blocks all negative login test scenarios (invalid credentials, empty username, empty password) from passing.

## Notes
- **Important observation:** Submitting a **valid username with an invalid password** correctly stays on the login page and displays the error message. The 405 error only occurs when the username is **unrecognized** or when fields are **empty**. This suggests the server-side authentication flow handles known-user failures differently from unknown-user failures.
- The issue likely stems from the login form's action URL or the server-side endpoint not properly handling failed authentication attempts for unknown users — instead of returning the login page with an error, it may be redirecting to a route that does not accept the current HTTP method.
- Investigate whether the login form `POST` action is redirecting to a page/route that only supports `GET`, causing the 405 response specifically when the username is not found in the system.
