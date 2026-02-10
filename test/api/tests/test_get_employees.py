"""
Tests for GET /api/Employees — List all employees.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_json_response,
    assert_employee_in_list,
    assert_employee_response_schema,
)


class TestGetAllEmployees:
    """Test suite for retrieving the list of all employees."""

    @pytest.mark.smoke
    @pytest.mark.positive
    def test_get_all_employees_returns_200(self, employees_client):
        """GET /api/Employees should return 200 OK."""
        response = employees_client.get_all_employees()
        assert_status_code(response, 200)

    @pytest.mark.positive
    def test_get_all_employees_returns_json_list(self, employees_client):
        """GET /api/Employees should return a JSON array."""
        response = employees_client.get_all_employees()
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert isinstance(data, list), f"Expected list, got {type(data)}"

    @pytest.mark.positive
    def test_get_all_employees_contains_created_employee(
        self, employees_client, created_employee
    ):
        """A newly created employee should appear in the list."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        response = employees_client.get_all_employees()
        assert_status_code(response, 200)
        employees = response.json()

        assert_employee_in_list(employees, employee_id)

    @pytest.mark.positive
    def test_get_all_employees_response_schema(
        self, employees_client, created_employee
    ):
        """Each employee in the list should conform to the Employee schema."""
        response = employees_client.get_all_employees()
        assert_status_code(response, 200)
        employees = response.json()

        assert len(employees) > 0, "Expected at least one employee in the list"
        for emp in employees:
            assert_employee_response_schema(emp)

    @pytest.mark.positive
    def test_get_all_employees_returns_expected_fields(
        self, employees_client, created_employee
    ):
        """Each employee should contain all expected fields."""
        expected_fields = [
            "id", "username", "firstName", "lastName", "dependants",
            "salary", "gross", "benefitsCost", "net",
        ]
        response = employees_client.get_all_employees()
        assert_status_code(response, 200)
        employees = response.json()

        for emp in employees:
            for field in expected_fields:
                assert field in emp, f"Missing field '{field}' in employee response"
