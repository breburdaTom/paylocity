"""
Application settings loaded from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod")
API_TOKEN = os.getenv("API_TOKEN", "")

# Timeouts (seconds)
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))

# Endpoints
EMPLOYEES_ENDPOINT = "/api/Employees"


def get_employee_by_id_endpoint(employee_id: str) -> str:
    """Return the endpoint for a specific employee by ID."""
    return f"{EMPLOYEES_ENDPOINT}/{employee_id}"
