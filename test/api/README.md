# Paylocity Benefits API — Test Suite

Automated API test framework for the Paylocity Benefits API using **Python** and **pytest**.

---

## Project Structure

```
test/api/
├── pytest.ini                  # Pytest configuration
├── requirements.txt            # Python dependencies
├── conftest.py                 # Shared fixtures (session client, employee factory)
├── .env.example                # Environment variable template
├── README.md                   # This file
├── config/
│   └── settings.py             # Centralized settings (URLs, auth, timeouts)
├── clients/
│   ├── base_client.py          # Base HTTP client (requests wrapper)
│   └── employees_client.py     # Employee-specific API client
├── models/
│   └── employee.py             # Pydantic models for request/response validation
├── utils/
│   ├── data_factory.py         # Test data generators (Faker-based)
│   └── assertions.py           # Reusable assertion helpers
└── tests/
    ├── test_get_employees.py           # GET /api/Employees
    ├── test_get_employee_by_id.py      # GET /api/Employees/{id}
    ├── test_create_employee.py         # POST /api/Employees
    ├── test_update_employee.py         # PUT /api/Employees
    ├── test_delete_employee.py         # DELETE /api/Employees/{id}
    ├── test_employee_crud_flow.py      # End-to-end CRUD lifecycle
    └── test_employee_benefits_calculation.py  # Benefits computation tests
```

---

## Setup

1. **Create a virtual environment** (recommended):
   ```bash
   cd test/api
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your BASE_URL and credentials
   ```

---

## Running Tests

### Run all tests
```bash
pytest
```

### Run with HTML report
```bash
pytest --html=report.html --self-contained-html
```

### Run by marker
```bash
pytest -m smoke          # Smoke tests only
pytest -m regression     # Regression suite
pytest -m positive       # Happy path tests
pytest -m negative       # Error/edge case tests
pytest -m crud           # CRUD operation tests
```

### Run a specific test file
```bash
pytest tests/test_create_employee.py
```

### Run a specific test
```bash
pytest tests/test_create_employee.py::TestCreateEmployee::test_create_employee_returns_200
```

---

## Markers

| Marker       | Description                              |
|-------------|------------------------------------------|
| `smoke`     | Quick validation of core functionality   |
| `regression`| Full regression test suite               |
| `positive`  | Happy path / valid input tests           |
| `negative`  | Error handling / invalid input tests     |
| `crud`      | CRUD operation tests                     |
