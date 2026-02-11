# Paylocity Benefits Dashboard — E2E Tests

End-to-end tests for the Paylocity Benefits Dashboard using [Playwright](https://playwright.dev/).

## Project Structure

```
test/e2e/
├── fixtures/
│   ├── auth.fixture.ts         # Auto-login + wait for dashboard ready
│   └── base.fixture.ts         # Base fixture providing page objects
├── pages/
│   ├── dashboard.page.ts       # Dashboard page (table, delete confirmation)
│   ├── employee-modal.page.ts  # Add/Edit Employee modal
│   ├── login.page.ts           # Login page
│   └── index.ts                # Barrel export
├── tests/
│   ├── login.spec.ts           # Login page tests
│   ├── add-employee.spec.ts    # Add Employee tests
│   ├── edit-employee.spec.ts   # Edit Employee tests
│   └── delete-employee.spec.ts # Delete Employee tests
├── utils/
│   ├── benefits-calculator.ts  # Benefits cost calculation
│   ├── data-factory.ts         # Random test data (Faker)
│   └── env.ts                  # Environment variable validation
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup

```bash
cd test/e2e
npm install
npx playwright install chromium
```

## Configuration

Environment variables are loaded from `paylocity/.env` (project root), shared with the API suite.

```bash
# From project root
cp .env.example .env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `BASE_URL` | Base URL of the application | Yes |
| `TEST_USERNAME` | Login username | Yes |
| `TEST_PASSWORD` | Login password | Yes |

Missing variables cause an immediate failure with a clear error message.

## Running Tests

```bash
npm test                # All tests (headless)
npm run test:headed     # Visible browser
npm run test:ui         # Playwright UI mode
npm run test:debug      # Step-by-step debug
npm run test:report     # Open HTML report
```

## Known Failing Tests

Two tests are **intentionally left failing** because they catch real application bugs:

| Test | Bug |
|------|-----|
| `login.spec.ts` — "should show error with invalid credentials" | App returns HTTP 405 instead of showing error (ui-bugs/defect6) |
| `edit-employee.spec.ts` — "should update employee dependants and recalculate benefits" | Update doesn't persist dependants change (ui-bugs/defect8) |

## Issues Encountered During Development

**Modal selector ambiguity** — The page has two Bootstrap modals (`#employeeModal` for add/edit, `#deleteModal` for delete confirmation). Both contain `.modal-content`, which caused Playwright strict mode violations. Fixed by scoping to `#employeeModal .modal-content`.

**Race condition on page load** — Playwright clicked the "Add Employee" button before jQuery event handlers were bound. The button was visible (HTML rendered) but the `$('#add').on('click', ...)` handler wasn't attached yet. Fixed by waiting for table data rows to appear in `auth.fixture.ts`, which proves all JS has executed.

**Delete confirmation not handled** — `clickDeleteForEmployee()` only clicked the X icon on the row but didn't click the "Delete" button in the confirmation modal. Fixed by adding a `confirmDelete()` step that clicks the button and waits for the modal to close.

**afterEach cleanup timeout** — Edit tests had an `afterEach` that tried to delete the employee by its original name. When the test already deleted it or renamed it, the locator would wait until the 30s test timeout. Fixed by checking `row.isVisible()` before attempting deletion.
