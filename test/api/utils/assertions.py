"""
Reusable assertion helpers for API response validation.
"""

from models.employee import EmployeeResponse


def assert_status_code(response, expected_code: int):
    """Assert the HTTP status code matches the expected value."""
    assert response.status_code == expected_code, (
        f"Expected status {expected_code}, got {response.status_code}. "
        f"Response body: {response.text}"
    )


def assert_employee_response_schema(data: dict):
    """Validate that the response data matches the EmployeeResponse schema."""
    employee = EmployeeResponse(**data)
    assert employee.firstName is not None
    assert employee.lastName is not None
    assert employee.username is not None
    return employee


def assert_employee_fields(data: dict, expected: dict):
    """Assert that specific fields in the employee response match expected values."""
    for key, value in expected.items():
        assert data.get(key) == value, (
            f"Field '{key}': expected '{value}', got '{data.get(key)}'"
        )


def assert_json_response(response):
    """Assert the response has a JSON content type and return parsed JSON."""
    content_type = response.headers.get("Content-Type", "")
    assert "application/json" in content_type, (
        f"Expected JSON content type, got '{content_type}'"
    )
    return response.json()


def assert_employee_in_list(employees: list, employee_id: str) -> dict:
    """Assert that an employee with the given ID exists in the list."""
    matches = [e for e in employees if str(e.get("id")) == str(employee_id)]
    assert len(matches) == 1, (
        f"Expected employee with id '{employee_id}' in list, found {len(matches)}"
    )
    return matches[0]


def assert_employee_not_in_list(employees: list, employee_id: str):
    """Assert that an employee with the given ID does NOT exist in the list."""
    matches = [e for e in employees if str(e.get("id")) == str(employee_id)]
    assert len(matches) == 0, (
        f"Expected employee with id '{employee_id}' NOT in list, but found {len(matches)}"
    )
