"""Detection CRUD and inference endpoints."""

from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from database import get_database
from models import DetectionCreate, DetectionInDB, DetectionUpdate
from vision.object_detection import engine
from vision.navigation import get_navigation_instruction

router = APIRouter(prefix="/detections", tags=["detections"])


def _to_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId as exc:
        raise HTTPException(status_code=400, detail="Invalid detection id") from exc



def _serialize_detection(doc: dict) -> DetectionInDB:
    return DetectionInDB(
        id=str(doc["_id"]),
        object_name=doc["object_name"],
        confidence=doc["confidence"],
        location=doc["location"],
        timestamp=doc["timestamp"],
    )


@router.get("", response_model=list[DetectionInDB])
async def get_detections(db: AsyncIOMotorDatabase = Depends(get_database)):
    docs = await db.detections.find().sort("timestamp", -1).to_list(length=200)
    return [_serialize_detection(doc) for doc in docs]


@router.get("/{detection_id}", response_model=DetectionInDB)
async def get_detection(detection_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await db.detections.find_one({"_id": _to_object_id(detection_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Detection not found")
    return _serialize_detection(doc)


@router.post("", response_model=DetectionInDB)
async def create_detection(payload: DetectionCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = payload.model_dump()
    result = await db.detections.insert_one(doc)
    created = await db.detections.find_one({"_id": result.inserted_id})
    return _serialize_detection(created)


@router.put("/{detection_id}", response_model=DetectionInDB)
async def update_detection(detection_id: str, payload: DetectionUpdate, db: AsyncIOMotorDatabase = Depends(get_database)):
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update_data:
        await db.detections.update_one({"_id": _to_object_id(detection_id)}, {"$set": update_data})
    doc = await db.detections.find_one({"_id": _to_object_id(detection_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Detection not found")
    return _serialize_detection(doc)


@router.delete("/{detection_id}")
async def delete_detection(detection_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    result = await db.detections.delete_one({"_id": _to_object_id(detection_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Detection not found")
    return {"status": "ok", "message": "Detection deleted"}


@router.post("/run", response_model=list[DetectionInDB])
async def run_detection(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Trigger one detection cycle and persist results."""
    detections = await engine.detect_once()
    saved_items: list[DetectionInDB] = []

    for item in detections:
        item.setdefault("timestamp", datetime.utcnow())
        await db.detections.insert_one(item)
        doc = await db.detections.find_one(
            {"object_name": item["object_name"], "timestamp": item["timestamp"]}
        )
        if doc:
            saved_items.append(_serialize_detection(doc))
            engine.speak_guidance(item["object_name"], item["location"])

    return saved_items


@router.get("/navigation/suggest")
async def navigation_suggest():
    return {"direction": get_navigation_instruction()}
