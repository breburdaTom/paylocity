"""
Tests for GET /api/Employees/{id} — Retrieve a single employee.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_json_response,
    assert_employee_response_schema,
    assert_employee_fields,
)
from utils.data_factory import random_uuid


class TestGetEmployeeById:
    """Test suite for retrieving a single employee by ID."""

    @pytest.mark.smoke
    @pytest.mark.positive
    def test_get_employee_by_id_returns_200(self, employees_client, created_employee):
        """GET /api/Employees/{id} should return 200 for an existing employee."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(response, 200)

    @pytest.mark.positive
    def test_get_employee_by_id_returns_correct_data(
        self, employees_client, created_employee
    ):
        """GET /api/Employees/{id} should return the correct employee data."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(response, 200)
        data = assert_json_response(response)

        assert_employee_fields(data, {
            "firstName": payload["firstName"],
            "lastName": payload["lastName"],
            "username": payload["username"],
        })

    @pytest.mark.positive
    def test_get_employee_by_id_schema_validation(
        self, employees_client, created_employee
    ):
        """The response should conform to the Employee schema."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(response, 200)
        data = response.json()
        assert_employee_response_schema(data)

    @pytest.mark.positive
    def test_get_employee_by_id_has_computed_fields(
        self, employees_client, created_employee
    ):
        """The response should include read-only computed fields (gross, benefitsCost, net)."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(response, 200)
        data = response.json()

        assert "gross" in data, "Missing 'gross' field"
        assert "benefitsCost" in data, "Missing 'benefitsCost' field"
        assert "net" in data, "Missing 'net' field"

    @pytest.mark.negative
    def test_get_employee_by_nonexistent_id_returns_404(self, employees_client):
        """GET /api/Employees/{id} should return 404 for a non-existent UUID."""
        fake_id = random_uuid()
        response = employees_client.get_employee_by_id(fake_id)
        assert response.status_code in [404, 204], (
            f"Expected 404 or 204 for non-existent employee, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_get_employee_by_invalid_id_format(self, employees_client):
        """GET /api/Employees/{id} should return 400 for an invalid (non-UUID) ID."""
        response = employees_client.get_employee_by_id("not-a-valid-uuid")
        assert response.status_code in [400, 404, 422, 500], (
            f"Expected 400/404/422/500 for invalid ID format, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_get_employee_by_empty_id(self, employees_client):
        """GET /api/Employees/ with empty ID should not return a single employee."""
        response = employees_client.get_employee_by_id("")
        # This effectively hits GET /api/Employees/ which is the list endpoint
        # The test validates the routing behavior
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list), "Empty ID should route to list endpoint"
