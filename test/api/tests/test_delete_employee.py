"""
Tests for DELETE /api/Employees/{id} — Delete an employee.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_employee_not_in_list,
)
from utils.data_factory import generate_employee_payload, random_uuid


class TestDeleteEmployee:
    """Test suite for deleting employees via DELETE."""

    @pytest.mark.smoke
    @pytest.mark.positive
    @pytest.mark.crud
    def test_delete_employee_returns_200(self, employees_client):
        """DELETE /api/Employees/{id} should return 200 for an existing employee."""
        # Create an employee to delete
        payload = generate_employee_payload()
        create_response = employees_client.create_employee(payload)
        assert_status_code(create_response, 200)
        employee_id = str(create_response.json()["id"])

        # Delete
        response = employees_client.delete_employee(employee_id)
        assert_status_code(response, 200)

    @pytest.mark.positive
    @pytest.mark.crud
    def test_delete_employee_removes_from_list(self, employees_client):
        """A deleted employee should no longer appear in GET /api/Employees."""
        # Create
        payload = generate_employee_payload()
        create_response = employees_client.create_employee(payload)
        assert_status_code(create_response, 200)
        employee_id = str(create_response.json()["id"])

        # Delete
        delete_response = employees_client.delete_employee(employee_id)
        assert_status_code(delete_response, 200)

        # Verify not in list
        list_response = employees_client.get_all_employees()
        assert_status_code(list_response, 200)
        employees = list_response.json()
        assert_employee_not_in_list(employees, employee_id)

    @pytest.mark.positive
    @pytest.mark.crud
    def test_delete_employee_not_retrievable_by_id(self, employees_client):
        """A deleted employee should return 404 when fetched by ID."""
        # Create
        payload = generate_employee_payload()
        create_response = employees_client.create_employee(payload)
        assert_status_code(create_response, 200)
        employee_id = str(create_response.json()["id"])

        # Delete
        delete_response = employees_client.delete_employee(employee_id)
        assert_status_code(delete_response, 200)

        # Verify not retrievable
        get_response = employees_client.get_employee_by_id(employee_id)
        assert get_response.status_code in [404, 204], (
            f"Expected 404/204 for deleted employee, got {get_response.status_code}"
        )

    # --- Negative Tests ---

    @pytest.mark.negative
    def test_delete_nonexistent_employee_returns_404(self, employees_client):
        """DELETE /api/Employees/{id} with non-existent UUID should return 404."""
        fake_id = random_uuid()
        response = employees_client.delete_employee(fake_id)
        assert response.status_code in [404, 204], (
            f"Expected 404/204 for non-existent employee, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_delete_employee_invalid_id_format(self, employees_client):
        """DELETE /api/Employees/{id} with invalid ID should return 400."""
        response = employees_client.delete_employee("not-a-valid-uuid")
        assert response.status_code in [400, 404, 422], (
            f"Expected 400/404/422 for invalid ID format, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_delete_already_deleted_employee(self, employees_client):
        """DELETE on an already-deleted employee should return 404."""
        # Create and delete
        payload = generate_employee_payload()
        create_response = employees_client.create_employee(payload)
        assert_status_code(create_response, 200)
        employee_id = str(create_response.json()["id"])

        delete_response = employees_client.delete_employee(employee_id)
        assert_status_code(delete_response, 200)

        # Try to delete again
        second_delete = employees_client.delete_employee(employee_id)
        assert second_delete.status_code in [404, 204], (
            f"Expected 404/204 for already-deleted employee, got {second_delete.status_code}"
        )
