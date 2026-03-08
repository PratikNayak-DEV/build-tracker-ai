from functools import lru_cache

from model import MobileNetConstructionClassifier


@lru_cache(maxsize=1)
def get_classifier() -> MobileNetConstructionClassifier:
    return MobileNetConstructionClassifier()
