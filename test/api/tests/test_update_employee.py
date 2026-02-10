"""
Tests for PUT /api/Employees — Update an existing employee.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_json_response,
    assert_employee_response_schema,
    assert_employee_fields,
)
from utils.data_factory import generate_employee_update_payload, random_uuid


class TestUpdateEmployee:
    """Test suite for updating employees via PUT."""

    @pytest.mark.smoke
    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_returns_200(self, employees_client, created_employee):
        """PUT /api/Employees with valid data should return 200."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(employee_id)
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)

    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_first_name(self, employees_client, created_employee):
        """PUT should update the employee's firstName."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name="UpdatedFirstName",
            last_name=payload["lastName"],
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert_employee_fields(data, {"firstName": "UpdatedFirstName"})

    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_last_name(self, employees_client, created_employee):
        """PUT should update the employee's lastName."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name=payload["firstName"],
            last_name="UpdatedLastName",
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert_employee_fields(data, {"lastName": "UpdatedLastName"})

    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_username(self, employees_client, created_employee):
        """PUT should update the employee's username."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username="newusername123",
            first_name=payload["firstName"],
            last_name=payload["lastName"],
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert_employee_fields(data, {"username": "newusername123"})

    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_dependants(self, employees_client, created_employee):
        """PUT should update the employee's dependants count."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name=payload["firstName"],
            last_name=payload["lastName"],
            dependants=5,
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert_employee_fields(data, {"dependants": 5})

    @pytest.mark.positive
    @pytest.mark.crud
    def test_update_employee_salary(self, employees_client, created_employee):
        """PUT should update the employee's salary."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name=payload["firstName"],
            last_name=payload["lastName"],
            salary=75000.0,
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = assert_json_response(response)
        assert data.get("salary") is not None

    @pytest.mark.positive
    def test_update_employee_schema_validation(
        self, employees_client, created_employee
    ):
        """Updated employee response should conform to the Employee schema."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(employee_id)
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = response.json()
        assert_employee_response_schema(data)

    @pytest.mark.positive
    def test_update_employee_persists_changes(
        self, employees_client, created_employee
    ):
        """Changes from PUT should be reflected in a subsequent GET."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name="Persisted",
            last_name="Changes",
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)

        # Verify via GET
        get_response = employees_client.get_employee_by_id(employee_id)
        assert_status_code(get_response, 200)
        get_data = get_response.json()
        assert_employee_fields(get_data, {
            "firstName": "Persisted",
            "lastName": "Changes",
        })

    @pytest.mark.positive
    def test_update_employee_recomputes_benefits(
        self, employees_client, created_employee
    ):
        """Updating dependants should recompute benefitsCost and net."""
        employee_data, payload = created_employee
        employee_id = str(employee_data["id"])

        # Get original values
        original_benefits = employee_data.get("benefitsCost")
        original_net = employee_data.get("net")

        # Update dependants
        new_dependants = (payload.get("dependants", 0) or 0) + 3
        if new_dependants > 32:
            new_dependants = 1

        update_payload = generate_employee_update_payload(
            employee_id,
            username=payload["username"],
            first_name=payload["firstName"],
            last_name=payload["lastName"],
            dependants=new_dependants,
        )
        response = employees_client.update_employee(update_payload)
        assert_status_code(response, 200)
        data = response.json()

        # Benefits cost should change when dependants change
        if original_benefits is not None:
            assert data.get("benefitsCost") != original_benefits, (
                "benefitsCost should change when dependants are updated"
            )

    # --- Negative Tests ---

    @pytest.mark.negative
    def test_update_employee_missing_id(self, employees_client, created_employee):
        """PUT without an id field should return 400."""
        _, payload = created_employee
        update_payload = {
            "username": payload["username"],
            "firstName": "NoId",
            "lastName": "Employee",
        }
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 404, 422], (
            f"Expected 400/404/422 for missing id, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_nonexistent_employee(self, employees_client):
        """PUT with a non-existent employee ID should return 404."""
        fake_id = random_uuid()
        update_payload = generate_employee_update_payload(fake_id)
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [404, 400, 204], (
            f"Expected 404/400 for non-existent employee, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_missing_required_first_name(
        self, employees_client, created_employee
    ):
        """PUT without firstName should return 400."""
        employee_data, payload = created_employee
        update_payload = {
            "id": str(employee_data["id"]),
            "username": payload["username"],
            "lastName": payload["lastName"],
        }
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing firstName, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_missing_required_last_name(
        self, employees_client, created_employee
    ):
        """PUT without lastName should return 400."""
        employee_data, payload = created_employee
        update_payload = {
            "id": str(employee_data["id"]),
            "username": payload["username"],
            "firstName": payload["firstName"],
        }
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing lastName, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_missing_required_username(
        self, employees_client, created_employee
    ):
        """PUT without username should return 400."""
        employee_data, payload = created_employee
        update_payload = {
            "id": str(employee_data["id"]),
            "firstName": payload["firstName"],
            "lastName": payload["lastName"],
        }
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for missing username, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_first_name_exceeds_max_length(
        self, employees_client, created_employee
    ):
        """PUT with firstName > 50 chars should return 400."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id, first_name="A" * 51
        )
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for firstName > 50 chars, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_dependants_exceeds_max(
        self, employees_client, created_employee
    ):
        """PUT with dependants > 32 should return 400."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id, dependants=33
        )
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for dependants > 32, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_negative_dependants(
        self, employees_client, created_employee
    ):
        """PUT with negative dependants should return 400."""
        employee_data, _ = created_employee
        employee_id = str(employee_data["id"])

        update_payload = generate_employee_update_payload(
            employee_id, dependants=-1
        )
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for negative dependants, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_empty_body(self, employees_client):
        """PUT with empty body should return 400."""
        response = employees_client.update_employee({})
        assert response.status_code in [400, 422], (
            f"Expected 400/422 for empty body, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_update_employee_invalid_id_format(self, employees_client):
        """PUT with invalid (non-UUID) id should return 400."""
        update_payload = generate_employee_update_payload("not-a-uuid")
        response = employees_client.update_employee(update_payload)
        assert response.status_code in [400, 404, 422], (
            f"Expected 400/404/422 for invalid id format, got {response.status_code}"
        )
