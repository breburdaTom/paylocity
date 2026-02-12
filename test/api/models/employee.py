"""
Pydantic models for the Employee schema, used for request/response validation.
"""

from typing import Optional
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EmployeeRequest(BaseModel):
    """Model for creating/updating an employee (writable fields only)."""

    username: str = Field(..., min_length=1, max_length=50)
    firstName: str = Field(..., min_length=1, max_length=50)
    lastName: str = Field(..., min_length=1, max_length=50)
    dependants: Optional[int] = Field(default=0, ge=0, le=32)
    salary: Optional[float] = None


class EmployeeUpdateRequest(BaseModel):
    """Model for updating an employee (includes id)."""

    id: str
    username: str = Field(..., min_length=1, max_length=50)
    firstName: str = Field(..., min_length=1, max_length=50)
    lastName: str = Field(..., min_length=1, max_length=50)
    dependants: Optional[int] = Field(default=0, ge=0, le=32)
    salary: Optional[float] = None


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
