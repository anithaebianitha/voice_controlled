"""Camera control endpoints."""

from fastapi import APIRouter

from models import CameraCommandResponse
from vision.object_detection import engine

router = APIRouter(tags=["camera"])


@router.post("/start-camera", response_model=CameraCommandResponse)
async def start_camera():
    result = engine.start_camera()
    return CameraCommandResponse(**result)


@router.post("/stop-camera", response_model=CameraCommandResponse)
async def stop_camera():
    result = engine.stop_camera()
    return CameraCommandResponse(**result)
