# Paylocity Benefits API — Test Suite

API test framework for the Paylocity Benefits API using Python and pytest.

## Project Structure

```
test/api/
├── conftest.py                 # Shared fixtures (session client, employee factory)
├── pytest.ini                  # Pytest configuration
├── requirements.txt            # Python dependencies
├── config/
│   └── settings.py             # Centralized settings (URLs, auth, timeouts)
├── clients/
│   ├── base_client.py          # Base HTTP client (requests wrapper)
│   └── employees_client.py     # Employee-specific API client
├── models/
│   └── employee.py             # Pydantic models for request/response validation
├── utils/
│   ├── data_factory.py         # Test data generators (Faker)
│   └── assertions.py           # Reusable assertion helpers
└── tests/
    ├── test_get_employees.py
    ├── test_get_employee_by_id.py
    ├── test_create_employee.py
    ├── test_update_employee.py
    ├── test_delete_employee.py
    ├── test_employee_crud_flow.py
    └── test_employee_benefits_calculation.py
```

## Setup

```bash
cd test/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Environment variables are loaded from `paylocity/.env` (project root), shared with the E2E suite.

```bash
# From project root
cp .env.example .env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `BASE_URL` | Application base URL | Yes |
| `API_TOKEN` | API authentication token | Yes |

## Running Tests

```bash
pytest                          # All tests
pytest --html=report.html --self-contained-html  # With HTML report
pytest -m smoke                 # Smoke tests only
pytest -m negative              # Error/edge case tests
pytest tests/test_create_employee.py  # Specific file
```

## Markers

| Marker | Description |
|--------|-------------|
| `smoke` | Quick validation of core functionality |
| `regression` | Full regression suite |
| `positive` | Happy path tests |
| `negative` | Error handling / invalid input tests |
| `crud` | CRUD operation tests |
