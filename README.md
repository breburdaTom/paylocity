# Paylocity Benefits Dashboard — Test Suite

Automated test suite for the Paylocity Benefits Dashboard — a sample application that allows employers to manage employees and their dependents, with benefit cost calculations and paycheck deductions.

## Application Under Test

The Benefits Dashboard lets an employer:

- **Add** employees with first name, last name, and number of dependents
- **Edit** existing employee details
- **Delete** employees
- **Preview** benefit cost deductions per paycheck

### Benefits Calculation Rules

| Rule                        | Value   |
|-----------------------------|---------|
| Paycheck amount             | $2,000  |
| Paychecks per year          | 26      |
| Employee benefits cost/year | $1,000  |
| Dependent benefits cost/year| $500    |

---

## Project Structure

```
paylocity/
├── .env                        # Shared environment variables (not committed)
├── .env.example                # Template for .env
├── .github/workflows/
│   └── tests.yml               # CI pipeline (GitHub Actions)
├── test/
│   ├── api/                    # API test suite (Python + pytest)
│   └── e2e/                    # E2E test suite (TypeScript + Playwright)
├── api-bugs/                   # Documented API defects
├── ui-bugs/                    # Documented UI defects
└── defect*.md                  # Individual defect reports
```

---

## Test Suites

| Suite | Tech Stack | Location | Details |
|-------|-----------|----------|---------|
| **API Tests** | Python 3.12, pytest, requests, Pydantic | `test/api/` | [API Test README](test/api/README.md) |
| **E2E Tests** | TypeScript, Playwright, Faker | `test/e2e/` | [E2E Test README](test/e2e/README.md) |

---

## Quick Start

### 1. Configure environment variables

All variables are stored in a **single `.env` file at the project root**, shared by both test suites.

```bash
cp .env.example .env
# Edit .env with your actual values
```

| Variable         | Description                  | Required |
|------------------|------------------------------|----------|
| `BASE_URL`       | Application base URL         | Yes      |
| `API_TOKEN`      | API authentication token     | Yes      |
| `TEST_USERNAME`  | UI login username            | Yes      |
| `TEST_PASSWORD`  | UI login password            | Yes      |

> **No fallback defaults** — if any variable is missing, the test suite fails immediately with a clear error message.

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

---

## CI / GitHub Actions

The CI pipeline (`.github/workflows/tests.yml`) runs both suites **sequentially** on every push/PR to `main`/`master`:

1. **API Tests** — runs first
2. **E2E Tests** — runs after API tests finish (regardless of outcome)
3. **Test Results** — unified status gate for branch protection

Suites run sequentially to prevent **test data conflicts** against the shared backend.

### Required GitHub Secrets

| Secret           | Used By    |
|------------------|------------|
| `API_TOKEN`      | API tests  |
| `TEST_USERNAME`  | E2E tests  |
| `TEST_PASSWORD`  | E2E tests  |

`BASE_URL` is hardcoded in the workflow (not a secret — it's a public URL).

---

## Defect Reports

Discovered defects are documented in the repository root (`defect*.md`) and categorized in:

- `api-bugs/` — API-level defects
- `ui-bugs/` — UI-level defects
