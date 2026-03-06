# Voice-Controlled Real-Time Smart Vision System for Audio-Guided Object Detection and Navigation

A complete final-year project implementation using **React + FastAPI + MongoDB** for voice-driven smart vision assistance.

## Tech Stack

- **Frontend:** React.js, Bootstrap 5, Axios, Web Speech API, Chart.js
- **Backend:** FastAPI, OpenCV, YOLOv8 (Ultralytics), pyttsx3, SpeechRecognition
- **Database:** MongoDB (Motor async driver)

## Project Architecture

`React Frontend (3000) -> FastAPI Backend (8000) -> MongoDB`

## Folder Structure

```text
voice_controlled/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── .env.example
│   ├── routes/
│   │   ├── camera_routes.py
│   │   └── detection_routes.py
│   └── vision/
│       ├── object_detection.py
│       └── navigation.py
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── styles.css
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── CameraFeed.js
│       │   ├── VoiceControl.js
│       │   ├── ObjectList.js
│       │   └── DetectionTable.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── VisionSystem.js
│       │   ├── History.js
│       │   └── Dashboard.js
│       └── services/
│           └── api.js
├── requirements.txt
└── README.md
```

## MongoDB Schema

Collection: `detections`

```json
{
  "_id": "ObjectId",
  "object_name": "person",
  "confidence": 0.92,
  "location": "front",
  "timestamp": "2026-03-05T10:45:00"
}
```

## Backend Features

- Camera start/stop APIs
- YOLOv8 object detection for target objects (`person`, `chair`, `table`, `bottle`, `laptop`, `door`)
- TTS guidance using `pyttsx3`
- Simulated detection fallback when webcam/model unavailable
- MongoDB persistence for history
- Full CRUD for detections
- Navigation direction suggestion API
- CORS enabled for React frontend

## Frontend Features

- Responsive Bootstrap dashboard
- Voice command panel using Web Speech API
- Vision system control actions:
  - Start camera
  - Stop camera
  - Detect objects
  - Navigate
- Detection history table with update/delete
- Admin dashboard with total count + object distribution pie chart

## API Documentation

### Camera
- `POST /start-camera`
- `POST /stop-camera`

### Detections CRUD
- `GET /detections`
- `GET /detections/{id}`
- `POST /detections`
- `PUT /detections/{id}`
- `DELETE /detections/{id}`

### Runtime Utilities
- `POST /detections/run` - run one detection cycle + persist results
- `GET /detections/navigation/suggest` - get navigation direction

FastAPI Swagger UI available at: `http://localhost:8000/docs`

## Setup Instructions

### 1) Clone and open project
```bash
git clone <repo-url>
cd voice_controlled
```

### 2) Backend setup
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp backend/.env.example backend/.env
```

Edit environment values if needed:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=smart_vision
```

Run backend (**port 8000**):
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3) Frontend setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on **port 3000**.

Optional environment file:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Voice Command Examples

- "Start camera"
- "Stop camera"
- "Detect objects"
- "Navigate"

## Notes

- `object_detection.py` attempts real YOLOv8 + webcam inference.
- If webcam/model support is unavailable in the local environment, the app switches to simulation mode so the project remains demo-ready.
