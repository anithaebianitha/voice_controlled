"""FastAPI application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_mongo_connection, connect_to_mongo
from routes.camera_routes import router as camera_router
from routes.detection_routes import router as detection_router

app = FastAPI(
    title="Voice-Controlled Real-Time Smart Vision API",
    version="1.0.0",
    description="Backend for audio-guided object detection and navigation.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_mongo_connection()


@app.get("/")
async def root():
    return {"status": "ok", "message": "Smart Vision backend is running"}


app.include_router(camera_router)
app.include_router(detection_router)
