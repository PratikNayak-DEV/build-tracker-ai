from dataclasses import dataclass
from typing import List

import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, decode_predictions, preprocess_input
from tensorflow.keras.preprocessing import image


STAGES: List[str] = ["Foundation", "Super Structure", "Facade", "Interior", "Completed"]


@dataclass
class Prediction:
    stage: str
    confidence: float


class MobileNetConstructionClassifier:
    """
    Lightweight prototype classifier.

    It uses pretrained MobileNetV2 ImageNet predictions and maps semantic labels
    to construction stages. If no direct semantic match exists, it falls back to
    deterministic visual heuristics.
    """

    def __init__(self) -> None:
        self.model = MobileNetV2(weights="imagenet")

    def _map_label_to_stage(self, label: str) -> str | None:
        label = label.lower()

        mapping_keywords = {
            "Foundation": ["quarry", "sandbar", "volcano", "cliff"],
            "Super Structure": ["crane", "steel", "tower", "bridge", "scaffold"],
            "Facade": ["window", "church", "palace", "building"],
            "Interior": ["home", "room", "library", "wardrobe", "desk"],
            "Completed": ["castle", "mosque", "monastery", "dome", "hotel"],
        }

        for stage, keywords in mapping_keywords.items():
            if any(keyword in label for keyword in keywords):
                return stage
        return None

    def _heuristic_stage(self, img_arr: np.ndarray) -> str:
        rgb_mean = img_arr.mean(axis=(0, 1))
        brightness = rgb_mean.mean()
        texture = np.std(img_arr)

        if brightness < 70:
            return "Foundation"
        if texture > 65 and brightness < 130:
            return "Super Structure"
        if brightness >= 130 and rgb_mean[2] > rgb_mean[0]:
            return "Facade"
        if brightness >= 145 and texture < 55:
            return "Interior"
        return "Completed"

    def predict(self, image_path: str) -> Prediction:
        loaded = image.load_img(image_path, target_size=(224, 224))
        img_arr = image.img_to_array(loaded)

        batch = np.expand_dims(img_arr, axis=0)
        batch = preprocess_input(batch)

        preds = self.model.predict(batch, verbose=0)
        decoded = decode_predictions(preds, top=1)[0][0]
        top_label = decoded[1]
        top_confidence = float(decoded[2])

        stage = self._map_label_to_stage(top_label)

        if stage is None:
            stage = self._heuristic_stage(img_arr)
            confidence = 0.55
        else:
            confidence = max(0.6, min(0.95, top_confidence))

        return Prediction(stage=stage, confidence=round(confidence, 2))
