"""Pydantic models for detection APIs."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DetectionBase(BaseModel):
    object_name: str = Field(..., example="person")
    confidence: float = Field(..., ge=0, le=1, example=0.92)
    location: str = Field(..., example="front")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DetectionCreate(DetectionBase):
    pass


class DetectionUpdate(BaseModel):
    object_name: Optional[str] = None
    confidence: Optional[float] = Field(default=None, ge=0, le=1)
    location: Optional[str] = None
    timestamp: Optional[datetime] = None


class DetectionInDB(DetectionBase):
    id: str


class CameraCommandResponse(BaseModel):
    status: str
    message: str
