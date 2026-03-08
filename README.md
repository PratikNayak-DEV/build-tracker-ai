# Construction Progress Monitoring using Image Analysis

This repository now contains:

- Existing **React frontend** (Vite + TypeScript)
- New **Node.js + Express backend** (`backend/`)
- New **Python FastAPI ML service** (`ml-service/`)

The backend uploads construction images, saves metadata in MongoDB, sends images to the ML service, stores predicted stage/progress, and exposes history APIs.

---

## Architecture

React Frontend  
→ Node.js Express API  
→ Python FastAPI ML service  
→ MongoDB

---

## Construction Stages + Progress Mapping

- Foundation → 10%
- Super Structure → 40%
- Facade → 65%
- Interior → 85%
- Completed → 100%

---

## Backend Setup (`backend/`)

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Defaults:

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/construction-progress`
- `ML_SERVICE_URL=http://127.0.0.1:8000/predict`

### 3) Start backend

```bash
npm start
```

Backend health check:

```bash
curl http://localhost:5000/health
```

---

## ML Service Setup (`ml-service/`)

### 1) Create a virtual environment (recommended)

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate
```

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Start ML service

```bash
python main.py
```

ML service health check:

```bash
curl http://localhost:8000/health
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### `POST /api/upload`
Upload an image and store metadata in MongoDB.

**Form-data**
- `image` (file)
- `projectName` (string)
- `activityType` (string)

**Response**
```json
{
  "message": "Image uploaded successfully.",
  "image": {
    "_id": "...",
    "projectName": "Tower-A",
    "activityType": "Facade",
    "imagePath": "backend/uploads/17300000-test.jpg",
    "uploadDate": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### `POST /api/analyze`
Analyzes an image using ML service and computes project progress.

You can call this in two ways:

1) Analyze an already uploaded image:
- JSON body: `{ "imageId": "..." }`

2) Upload + analyze in one request:
- form-data with `image`, `projectName`, `activityType`

**Example response**
```json
{
  "stage": "Super Structure",
  "confidence": 0.82,
  "progressPercent": 40,
  "progressDelta": 30,
  "imageId": "..."
}
```

**Activity validation behavior**
If selected `activityType` doesn't match predicted stage:

```json
{
  "error": "Uploaded image appears to be Interior work. Please select correct activity type.",
  "detectedStage": "Interior"
}
```

---

### `GET /api/history`
Returns upload/analyze history.

**Response**
```json
{
  "count": 2,
  "data": [
    {
      "projectName": "Tower-A",
      "activityType": "Facade",
      "imagePath": "backend/uploads/17300000-a.jpg",
      "stage": "Facade",
      "uploadDate": "2026-01-01T00:00:00.000Z",
      "progressPercent": 65,
      "confidence": 0.78,
      "progressDelta": 25
    }
  ]
}
```

---

## How to Test Quickly with cURL

From the repo root:

```bash
# 1) Upload image
curl -X POST http://localhost:5000/api/upload \
  -F "projectName=Tower-A" \
  -F "activityType=Foundation" \
  -F "image=@/absolute/path/to/image.jpg"

# 2) Analyze existing uploaded image
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageId":"<paste-uploaded-id>"}'

# 3) View history
curl http://localhost:5000/api/history
```

---

## Notes on ML Model

- The ML service uses **MobileNetV2 pretrained on ImageNet**.
- Predictions are mapped to construction stages using semantic keyword matching.
- If no direct match is found, fallback visual heuristics are used to keep the prototype usable with limited construction-specific data.

This design is intentionally simple for local demos and can be replaced later with a fully trained construction-stage classifier.
