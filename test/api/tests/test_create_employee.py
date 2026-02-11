"""
Tests for POST /api/Employees — Create a new employee.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_json_response,
    assert_employee_response_schema,
    assert_employee_fields,
    assert_employee_in_list,
)
from utils.data_factory import generate_employee_payload


class TestCreateEmployee:
    """Test suite for creating employees via POST."""

    @pytest.mark.smoke
    @pytest.mark.positive
    @pytest.mark.crud
    def test_create_employee_returns_200(self, employees_client):
        """POST /api/Employees with valid data should return 200."""
        payload = generate_employee_payload()
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)

        # Cleanup
        data = response.json()
        if data.get("id"):
            employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.crud
    def test_create_employee_returns_employee_data(self, employees_client):
        """POST /api/Employees should return the created employee with an ID."""
        payload = generate_employee_payload()
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)

        assert "id" in data, "Response should contain an 'id' field"
        assert data["id"] is not None, "Employee ID should not be None"
        assert_employee_fields(data, {
            "firstName": payload["firstName"],
            "lastName": payload["lastName"],
            "username": payload["username"],
        })

        # Cleanup
        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.crud
    def test_create_employee_schema_validation(self, employees_client):
        """The created employee response should conform to the Employee schema."""
        payload = generate_employee_payload()
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()
        assert_employee_response_schema(data)

        # Cleanup
        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.crud
    def test_create_employee_appears_in_list(self, employees_client):
        """A newly created employee should be retrievable via GET /api/Employees."""
        payload = generate_employee_payload()
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()
        employee_id = str(data["id"])

        # Verify in list
        list_response = employees_client.get_all_employees()
        assert_status_code(list_response, 200)
        employees = list_response.json()
        assert_employee_in_list(employees, employee_id)

        # Cleanup
        employees_client.delete_employee(employee_id)

    @pytest.mark.positive
    @pytest.mark.crud
    def test_create_employee_retrievable_by_id(self, employees_client):
        """A newly created employee should be retrievable via GET /api/Employees/{id}."""
        payload = generate_employee_payload()
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()
        employee_id = str(data["id"])

        # Verify by ID
        get_response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(get_response, 200)
        get_data = get_response.json()
        assert_employee_fields(get_data, {
            "firstName": payload["firstName"],
            "lastName": payload["lastName"],
            "username": payload["username"],
        })

        # Cleanup
        employees_client.delete_employee(employee_id)

    @pytest.mark.positive
    def test_create_employee_with_zero_dependants(self, employees_client):
        """Creating an employee with 0 dependants should succeed."""
        payload = generate_employee_payload(dependants=0)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()
        assert data.get("dependants") == 0

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    def test_create_employee_with_max_dependants(self, employees_client):
        """Creating an employee with 32 dependants (max) should succeed."""
        payload = generate_employee_payload(dependants=32)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()
        assert data.get("dependants") == 32

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    def test_create_employee_computed_fields_populated(self, employees_client):
        """Created employee should have computed fields (gross, benefitsCost, net)."""
        payload = generate_employee_payload(salary=52000.0, dependants=2)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        assert data.get("gross") is not None, "gross should be computed"
        assert data.get("benefitsCost") is not None, "benefitsCost should be computed"
        assert data.get("net") is not None, "net should be computed"

        employees_client.delete_employee(str(data["id"]))

    # --- Negative Tests ---

    @pytest.mark.negative
    def test_create_employee_missing_required_first_name(self, employees_client):
        """POST without firstName should return 400."""
        payload = {
            "username": "testuser",
            "lastName": "Doe",
        }
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing firstName, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_missing_required_last_name(self, employees_client):
        """POST without lastName should return 400."""
        payload = {
            "username": "testuser",
            "firstName": "John",
        }
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing lastName, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_missing_required_username(self, employees_client):
        """POST without username should return 400."""
        payload = {
            "firstName": "John",
            "lastName": "Doe",
        }
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing username, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_empty_body(self, employees_client):
        """POST with empty body should return 400."""
        response = employees_client.create_employee({})
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for empty body, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_first_name_exceeds_max_length(self, employees_client):
        """POST with firstName exceeding 50 characters should return 400."""
        payload = generate_employee_payload(first_name="A" * 51)
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for firstName > 50 chars, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_last_name_exceeds_max_length(self, employees_client):
        """POST with lastName exceeding 50 characters should return 400."""
        payload = generate_employee_payload(last_name="B" * 51)
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for lastName > 50 chars, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_username_exceeds_max_length(self, employees_client):
        """POST with username exceeding 50 characters should return 400."""
        payload = generate_employee_payload(username="u" * 51)
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for username > 50 chars, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_negative_dependants(self, employees_client):
        """POST with negative dependants should return 400."""
        payload = generate_employee_payload(dependants=-1)
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for negative dependants, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_dependants_exceeds_max(self, employees_client):
        """POST with dependants > 32 should return 400."""
        payload = generate_employee_payload(dependants=33)
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for dependants > 32, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_invalid_salary_type(self, employees_client):
        """POST with non-numeric salary should return 400."""
        payload = generate_employee_payload()
        payload["salary"] = "not-a-number"
        response = employees_client.create_employee(payload)
        assert response.status_code in [400, 405, 422], (
            f"Expected 400/405/422 for invalid salary type, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_create_employee_null_body(self, employees_client):
        """POST with null/None body should return 400."""
        response = employees_client.create_employee(None)
        assert response.status_code in [400, 405, 415, 422], (
            f"Expected 400/405/415/422 for null body, got {response.status_code}"
        )
