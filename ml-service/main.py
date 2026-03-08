from fastapi import FastAPI, File, HTTPException, UploadFile

from predictor import get_classifier

app = FastAPI(title="Construction Stage ML Service")


@app.get('/health')
def health() -> dict:
    return {"status": "ok"}


@app.post('/predict')
async def predict(image: UploadFile = File(...)) -> dict:
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP images are allowed.")

    suffix = image.filename.split('.')[-1] if image.filename and '.' in image.filename else 'jpg'
    temp_path = f"/tmp/predict_input.{suffix}"

    try:
        with open(temp_path, 'wb') as f:
            f.write(await image.read())

        classifier = get_classifier()
        prediction = classifier.predict(temp_path)

        return {
            "stage": prediction.stage,
            "confidence": prediction.confidence,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=False)
