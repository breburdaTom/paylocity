# Paylocity Benefits Dashboard — Test Suite

Automated test suite for the Paylocity Benefits Dashboard, a sample app that lets employers manage employees and their dependents with benefit cost calculations.

## Application Under Test

The Benefits Dashboard allows:
- Adding employees with first name, last name, and number of dependents
- Editing existing employee details
- Deleting employees
- Previewing benefit cost deductions per paycheck

### Benefits Calculation Rules

| Rule | Value |
|------|-------|
| Paycheck amount | $2,000 |
| Paychecks per year | 26 |
| Employee benefits cost/year | $1,000 |
| Dependent benefits cost/year | $500 |

## Project Structure

```
paylocity/
├── .env.example                    # Template for environment variables
├── .github/
│   └── workflows/
│       └── tests.yml               # CI pipeline (GitHub Actions)
├── defects/
│   ├── api-bugs/                   # API defect reports (defect1–8)
│   └── ui-bugs/                    # UI defect reports (defect1–9)
├── ui-bugs/                        # Additional UI defect reports (defect10)
├── test/
    ├── api/                        # API tests (Python + pytest)
    └── e2e/                        # E2E tests (TypeScript + Playwright)   
```

## Test Suites

| Suite | Stack | Location | README |
|-------|-------|----------|--------|
| API Tests | Python 3.12, pytest, requests, Pydantic | `test/api/` | [test/api/README.md](test/api/README.md) |
| E2E Tests | TypeScript, Playwright, Faker | `test/e2e/` | [test/e2e/README.md](test/e2e/README.md) |

## Quick Start

### 1. Configure environment

Both suites share a single `.env` file at the project root:

```bash
cp .env.example .env
# Fill in your values
```

| Variable | Description | Required |
|----------|-------------|----------|
| `BASE_URL` | Application base URL | Yes |
| `API_TOKEN` | API authentication token | Yes |
| `TEST_USERNAME` | UI login username | Yes |
| `TEST_PASSWORD` | UI login password | Yes |

If any variable is missing, the test suite fails immediately with a clear error.

### 2. Run API tests

```bash
cd test/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest
```

### 3. Run E2E tests

```bash
cd test/e2e
npm install
npx playwright install chromium
npm test
```

## CI / GitHub Actions

The pipeline (`.github/workflows/tests.yml`) runs both suites sequentially on push/PR to `main`/`master`, and can also be triggered manually via `workflow_dispatch`. The suites run sequentially to avoid test data conflicts against the shared backend.

Required GitHub Secrets: `API_TOKEN`, `TEST_USERNAME`, `TEST_PASSWORD`.
`BASE_URL` is hardcoded in the workflow.

## Defect Reports

Discovered defects are documented in:
- `defects/api-bugs/` — API-level defects (defect1–8)
- `defects/ui-bugs/` — UI-level defects (defect1–9)
- `ui-bugs/` — Additional UI defects (defect10)
