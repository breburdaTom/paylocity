"""
End-to-end CRUD flow tests for the Employee API.
These tests validate the full lifecycle: Create → Read → Update → Delete.
"""

import pytest

from utils.assertions import (
    assert_status_code,
    assert_employee_fields,
    assert_employee_in_list,
    assert_employee_not_in_list,
)
from utils.data_factory import generate_employee_payload, generate_employee_update_payload


class TestEmployeeCRUDFlow:
    """Full CRUD lifecycle integration tests."""

    @pytest.mark.smoke
    @pytest.mark.crud
    @pytest.mark.regression
    def test_full_crud_lifecycle(self, employees_client):
        """
        Validate the complete employee lifecycle:
        1. Create a new employee
        2. Retrieve the employee by ID
        3. Verify the employee appears in the list
        4. Update the employee
        5. Verify the update persisted
        6. Delete the employee
        7. Verify the employee is gone
        """
        # --- Step 1: Create ---
        create_payload = generate_employee_payload(
            first_name="CRUDTest",
            last_name="Employee",
            dependants=2,
            salary=60000.0,
        )
        create_response = employees_client.create_employee(create_payload)
        assert_status_code(create_response, 200)
        created = create_response.json()
        employee_id = str(created["id"])
        assert employee_id is not None

        try:
            # --- Step 2: Read by ID ---
            get_response = employees_client.get_employee_by_id(employee_id)
            assert_status_code(get_response, 200)
            get_data = get_response.json()
            assert_employee_fields(get_data, {
                "firstName": "CRUDTest",
                "lastName": "Employee",
                "username": create_payload["username"],
            })

            # --- Step 3: Verify in list ---
            list_response = employees_client.get_all_employees()
            assert_status_code(list_response, 200)
            assert_employee_in_list(list_response.json(), employee_id)

            # --- Step 4: Update ---
            update_payload = generate_employee_update_payload(
                employee_id,
                username=create_payload["username"],
                first_name="UpdatedCRUD",
                last_name="UpdatedEmployee",
                dependants=5,
                salary=80000.0,
            )
            update_response = employees_client.update_employee(update_payload)
            assert_status_code(update_response, 200)

            # --- Step 5: Verify update persisted ---
            verify_response = employees_client.get_employee_by_id(employee_id)
            assert_status_code(verify_response, 200)
            verify_data = verify_response.json()
            assert_employee_fields(verify_data, {
                "firstName": "UpdatedCRUD",
                "lastName": "UpdatedEmployee",
                "dependants": 5,
            })

            # --- Step 6: Delete ---
            delete_response = employees_client.delete_employee(employee_id)
            assert_status_code(delete_response, 200)

            # --- Step 7: Verify deletion ---
            get_deleted = employees_client.get_employee_by_id(employee_id)
            assert get_deleted.status_code in [404, 204], (
                f"Expected 404/204 after deletion, got {get_deleted.status_code}"
            )

            list_after_delete = employees_client.get_all_employees()
            assert_status_code(list_after_delete, 200)
            assert_employee_not_in_list(list_after_delete.json(), employee_id)

        except Exception:
            # Ensure cleanup even if test fails mid-way
            employees_client.delete_employee(employee_id)
            raise

    @pytest.mark.regression
    def test_create_multiple_employees_and_verify_list(self, employees_client):
        """Create multiple employees and verify they all appear in the list."""
        created_ids = []
        num_employees = 3

        try:
            for i in range(num_employees):
                payload = generate_employee_payload(
                    first_name=f"Multi{i}",
                    last_name=f"Test{i}",
                )
                response = employees_client.create_employee(payload)
                assert_status_code(response, 200)
                created_ids.append(str(response.json()["id"]))

            # Verify all in list
            list_response = employees_client.get_all_employees()
            assert_status_code(list_response, 200)
            employees = list_response.json()

            for eid in created_ids:
                assert_employee_in_list(employees, eid)

        finally:
            # Cleanup
            for eid in created_ids:
                employees_client.delete_employee(eid)

    @pytest.mark.regression
    def test_update_does_not_change_id(self, employees_client):
        """Updating an employee should not change their ID."""
        payload = generate_employee_payload()
        create_response = employees_client.create_employee(payload)
        assert_status_code(create_response, 200)
        original_id = str(create_response.json()["id"])

        try:
            update_payload = generate_employee_update_payload(
                original_id,
                username=payload["username"],
                first_name="ChangedName",
                last_name="StillSameId",
            )
            update_response = employees_client.update_employee(update_payload)
            assert_status_code(update_response, 200)
            updated_id = str(update_response.json()["id"])

            assert original_id == updated_id, (
                f"Employee ID changed after update: {original_id} → {updated_id}"
            )
        finally:
            employees_client.delete_employee(original_id)
