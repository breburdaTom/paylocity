"""
Root conftest.py — shared fixtures for the entire API test suite.
"""

import pytest

from clients.employees_client import EmployeesClient
from utils.data_factory import generate_employee_payload


@pytest.fixture(scope="session")
def employees_client():
    """Provide a session-scoped EmployeesClient instance."""
    client = EmployeesClient()
    yield client
    client.close()


@pytest.fixture()
def created_employee(employees_client):
    """
    Create an employee before the test and delete it after.
    Yields a tuple of (response_data, payload) so tests can reference both.
    """
    payload = generate_employee_payload()
    response = employees_client.create_employee(payload)
    assert response.status_code == 200, (
        f"Setup: failed to create employee. Status: {response.status_code}, Body: {response.text}"
    )
    data = response.json()
    employee_id = data.get("id")

    yield data, payload

    # Teardown: delete the employee if it still exists
    if employee_id:
        employees_client.delete_employee(str(employee_id))
