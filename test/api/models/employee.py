"""Pydantic model used to validate employee API responses in tests."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class EmployeeResponse(BaseModel):
    """Model for validating the employee response from the API."""

    partitionKey: Optional[str] = None
    sortKey: Optional[UUID] = None
    username: str
    id: Optional[UUID] = None
    firstName: str
    lastName: str
    dependants: Optional[int] = None
    expiration: Optional[datetime] = None
    salary: Optional[float] = None
    gross: Optional[float] = None
    benefitsCost: Optional[float] = None
    net: Optional[float] = None
