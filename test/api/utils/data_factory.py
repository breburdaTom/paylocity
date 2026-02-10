"""
Test data factory for generating employee payloads.
"""

import uuid
from faker import Faker

fake = Faker()


def generate_employee_payload(
    username: str = None,
    first_name: str = None,
    last_name: str = None,
    dependants: int = 0,
    salary: float = 52000.0,
) -> dict:
    """Generate a valid employee creation payload."""
    return {
        "username": username or fake.user_name()[:50],
        "firstName": first_name or fake.first_name()[:50],
        "lastName": last_name or fake.last_name()[:50],
        "dependants": dependants,
        "salary": salary,
    }


def generate_employee_update_payload(
    employee_id: str,
    username: str = None,
    first_name: str = None,
    last_name: str = None,
    dependants: int = 0,
    salary: float = 52000.0,
) -> dict:
    """Generate a valid employee update payload (includes id)."""
    return {
        "id": employee_id,
        "username": username or fake.user_name()[:50],
        "firstName": first_name or fake.first_name()[:50],
        "lastName": last_name or fake.last_name()[:50],
        "dependants": dependants,
        "salary": salary,
    }


def random_uuid() -> str:
    """Return a random UUID string."""
    return str(uuid.uuid4())
