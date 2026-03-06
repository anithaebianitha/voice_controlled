"""YOLOv8 powered detection engine with fallback simulation mode."""

from __future__ import annotations

import asyncio
from datetime import datetime
from random import choice, random
from typing import Any

import numpy as np

from vision.navigation import build_guidance_text

try:
    import cv2
except Exception:  # pragma: no cover
    cv2 = None

try:
    import pyttsx3
except Exception:  # pragma: no cover
    pyttsx3 = None

try:
    from ultralytics import YOLO
except Exception:  # pragma: no cover
    YOLO = None

TARGET_CLASSES = {"person", "chair", "table", "bottle", "laptop", "door"}
LOCATIONS = ["left", "right", "front"]


class DetectionEngine:
    """Manages camera lifecycle and object detection logic."""

    def __init__(self) -> None:
        self.camera_running = False
        self.cap = None
        self.model = YOLO("yolov8n.pt") if YOLO else None
        self.tts = pyttsx3.init() if pyttsx3 else None

    def start_camera(self) -> dict[str, str]:
        """Open webcam if available."""
        if self.camera_running:
            return {"status": "ok", "message": "Camera already running"}

        if cv2 is None:
            self.camera_running = True
            return {"status": "warning", "message": "OpenCV unavailable, using simulation mode"}

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            self.camera_running = True
            return {"status": "warning", "message": "Webcam unavailable, using simulation mode"}

        self.cap = cap
        self.camera_running = True
        return {"status": "ok", "message": "Camera started"}

    def stop_camera(self) -> dict[str, str]:
        """Close webcam safely."""
        if self.cap is not None:
            self.cap.release()
            self.cap = None
        self.camera_running = False
        return {"status": "ok", "message": "Camera stopped"}

    async def detect_once(self) -> list[dict[str, Any]]:
        """Run one detection cycle and return normalized objects."""
        if not self.camera_running:
            return []

        if self.model and self.cap is not None and cv2 is not None:
            ret, frame = self.cap.read()
            if not ret:
                return await self._simulate_detection()

            results = self.model(frame, verbose=False)
            detections: list[dict[str, Any]] = []
            for result in results:
                for box in result.boxes:
                    class_name = self.model.names[int(box.cls[0])]
                    if class_name not in TARGET_CLASSES:
                        continue

                    conf = float(box.conf[0])
                    location = self._estimate_location(frame, box.xyxy[0].tolist())
                    item = {
                        "object_name": class_name,
                        "confidence": round(conf, 2),
                        "location": location,
                        "timestamp": datetime.utcnow(),
                    }
                    detections.append(item)
            return detections

        return await self._simulate_detection()

    async def _simulate_detection(self) -> list[dict[str, Any]]:
        """Generate synthetic detections when camera/model isn't available."""
        await asyncio.sleep(0.1)
        if random() < 0.35:
            return []
        name = choice(list(TARGET_CLASSES))
        return [
            {
                "object_name": name,
                "confidence": round(0.7 + random() * 0.29, 2),
                "location": choice(LOCATIONS),
                "timestamp": datetime.utcnow(),
            }
        ]

    def speak_guidance(self, object_name: str, location: str) -> str:
        """Convert detection to spoken instruction."""
        text = build_guidance_text(object_name, location)
        if self.tts:
            self.tts.say(text)
            self.tts.runAndWait()
        return text

    @staticmethod
    def _estimate_location(frame: np.ndarray, xyxy: list[float]) -> str:
        """Estimate location of object from x-center."""
        x1, _, x2, _ = xyxy
        center_x = (x1 + x2) / 2
        width = frame.shape[1]
        if center_x < width / 3:
            return "left"
        if center_x > 2 * width / 3:
            return "right"
        return "front"


engine = DetectionEngine()
