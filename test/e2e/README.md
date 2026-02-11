# Paylocity Benefits Dashboard — E2E Tests

End-to-end test suite for the Paylocity Benefits Dashboard application using [Playwright](https://playwright.dev/).

## Project Structure

```
test/e2e/
├── fixtures/               # Playwright test fixtures (POM wiring, auth)
│   ├── auth.fixture.ts     # Authenticated fixture (auto-login before tests)
│   └── base.fixture.ts     # Base fixture providing page objects
├── pages/                  # Page Object Models
│   ├── dashboard.page.ts   # Benefits Dashboard page
│   ├── employee-modal.page.ts  # Add/Edit Employee modal
│   ├── login.page.ts       # Login page
│   └── index.ts            # Barrel export
├── tests/                  # Test specs
│   ├── add-employee.spec.ts    # Scenario 1: Add Employee
│   ├── delete-employee.spec.ts # Scenario 3: Delete Employee
│   ├── edit-employee.spec.ts   # Scenario 2: Edit Employee
│   └── login.spec.ts           # Login page tests
├── utils/                  # Shared utilities
│   ├── benefits-calculator.ts  # Benefits cost calculation helpers
│   └── data-factory.ts         # Random test data generation
├── .env                    # Environment variables (not committed)
├── .env.example            # Example environment variables
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Setup

```bash
cd test/e2e
npm install
npx playwright install
```

## Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable   | Description                        | Default                                                                 |
|------------|------------------------------------|-------------------------------------------------------------------------|
| `BASE_URL` | Base URL of the application        | `https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod`          |
| `USERNAME` | Login username                     | `TestUser332`                                                           |
| `PASSWORD` | Login password                     | `k%&O0vIs48`                                                            |

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Debug tests step-by-step
npm run test:debug

# Open the HTML report
npm run test:report
```

## Selectors

All selectors in the Page Object Models are currently **placeholders** (e.g., `PLACEHOLDER_USERNAME_INPUT`). Replace them with actual CSS/XPath/test-id selectors once they are available.

### Files to update:
- `pages/login.page.ts` — Login form selectors
- `pages/dashboard.page.ts` — Dashboard table and action button selectors
- `pages/employee-modal.page.ts` — Modal form field selectors

## Benefits Calculation Rules

| Rule                          | Value              |
|-------------------------------|--------------------|
| Paycheck amount               | $2,000             |
| Paychecks per year            | 26                 |
| Employee benefits cost/year   | $1,000             |
| Dependent benefits cost/year  | $500               |
