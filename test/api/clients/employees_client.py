"""
API client for the /api/Employees endpoints.
"""

import requests

from clients.base_client import BaseClient
from config.settings import EMPLOYEES_ENDPOINT, get_employee_by_id_endpoint


class EmployeesClient(BaseClient):
    """Client for Employee CRUD operations."""

    def get_all_employees(self) -> requests.Response:
        """GET /api/Employees — Retrieve all employees."""
        return self.get(EMPLOYEES_ENDPOINT)

    def get_employee_by_id(self, employee_id: str) -> requests.Response:
        """GET /api/Employees/{id} — Retrieve a single employee by ID."""
        return self.get(get_employee_by_id_endpoint(employee_id))

    def create_employee(self, payload: dict) -> requests.Response:
        """POST /api/Employees — Create a new employee."""
        return self.post(EMPLOYEES_ENDPOINT, json=payload)

    def update_employee(self, payload: dict) -> requests.Response:
        """PUT /api/Employees — Update an existing employee."""
        return self.put(EMPLOYEES_ENDPOINT, json=payload)

    def delete_employee(self, employee_id: str) -> requests.Response:
        """DELETE /api/Employees/{id} — Delete an employee by ID."""
        return self.delete(get_employee_by_id_endpoint(employee_id))
