"""
Tests for API authentication — verifying endpoints reject unauthenticated requests.
"""

import pytest

from utils.data_factory import random_uuid


class TestAuthentication:

    @pytest.mark.smoke
    @pytest.mark.negative
    def test_get_employees_without_auth_returns_401(self, unauthenticated_client):
        """GET /api/Employees without Authorization header should return 401."""
        response = unauthenticated_client.get_all_employees()
        assert response.status_code == 401, (
            f"Expected 401 for unauthenticated request, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_post_employee_without_auth_returns_401(self, unauthenticated_client):
        """POST /api/Employees without Authorization header should return 401."""
        response = unauthenticated_client.create_employee({
            "firstName": "Test",
            "lastName": "User",
        })
        assert response.status_code == 401, (
            f"Expected 401 for unauthenticated request, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_delete_employee_without_auth_returns_401(self, unauthenticated_client):
        """DELETE /api/Employees/{id} without Authorization header should return 401."""
        response = unauthenticated_client.delete_employee(random_uuid())
        assert response.status_code == 401, (
            f"Expected 401 for unauthenticated request, got {response.status_code}"
        )

    @pytest.mark.negative
    def test_put_employee_without_auth_returns_401(self, unauthenticated_client):
        """PUT /api/Employees without Authorization header should return 401."""
        response = unauthenticated_client.update_employee({
            "id": random_uuid(),
            "firstName": "Test",
            "lastName": "User",
            "username": "testuser",
        })
        assert response.status_code == 401, (
            f"Expected 401 for unauthenticated request, got {response.status_code}"
        )
