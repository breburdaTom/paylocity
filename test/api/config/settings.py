"""
Application settings loaded from environment variables.

All required variables are validated at import time.
If any required variable is missing, the module raises EnvironmentError
with a clear message.

Locally: values are loaded from the root .env file via python-dotenv.
On CI: values are injected via GitHub Secrets → workflow env.
"""

import os
from pathlib import Path
from dotenv import load_dotenv


def _find_project_root() -> Path:
    """Walk up from this file to find the project root (contains .git)."""
    current = Path(__file__).resolve().parent
    while current != current.parent:
        if (current / ".git").is_dir():
            return current
        current = current.parent
    raise FileNotFoundError("Could not find project root (.git directory not found)")


load_dotenv(_find_project_root() / ".env")


def _require_env(name: str) -> str:
    """Return the value of an environment variable or raise if missing."""
    value = os.getenv(name)
    if not value:
        raise EnvironmentError(
            f"Missing required environment variable: {name}. "
            f"Set it in .env at the project root, or as a GitHub Secret (CI)."
        )
    return value


BASE_URL = _require_env("BASE_URL")
API_TOKEN = _require_env("API_TOKEN")

# Timeouts (seconds) — optional, has a sensible default
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))

# Endpoints
EMPLOYEES_ENDPOINT = "/api/Employees"


def get_employee_by_id_endpoint(employee_id: str) -> str:
    """Return the endpoint for a specific employee by ID."""
    return f"{EMPLOYEES_ENDPOINT}/{employee_id}"
