import os
import joblib
import pandas as pd
import numpy as np
from app.feature_extractor import extract_url_features, generate_risk_reasons

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
MODEL_PATH = os.path.join(MODELS_DIR, "xgboost_phishing_model.pkl")
SCALER_PATH = os.path.join(MODELS_DIR, "minmax_scaler.pkl")
FEATURES_PATH = os.path.join(MODELS_DIR, "relieff_selected_features.pkl")

# Global variables for loaded artifacts
model = None
scaler = None
selected_features = None

def load_ml_artifacts():
    global model, scaler, selected_features
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(FEATURES_PATH):
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            selected_features = joblib.load(FEATURES_PATH)
            print("Successfully loaded trained XGBoost & ReliefF artifacts.")
            return True
    except Exception as e:
        print(f"Failed loading ML artifacts: {e}. Falling back to Rule-Based Mock Prediction.")
    return False

# Attempt artifact loading on module initialization
is_model_loaded = load_ml_artifacts()

def mock_rule_based_prediction(features: dict):
    """Fallback heuristic predictor when ML model is not yet trained."""
    score = 0.0
    if features.get("has_ip_address") == 1: score += 0.35
    if features.get("has_suspicious_words") == 1: score += 0.25
    if features.get("has_suspicious_tld") == 1: score += 0.20
    if features.get("url_length", 0) > 75: score += 0.15
    if features.get("num_subdomains", 0) >= 2: score += 0.15
    if features.get("num_at", 0) > 0: score += 0.20
    if features.get("has_https", 1) == 0: score += 0.10

    probability = min(0.99, max(0.01, round(score, 4)))
    prediction = 1 if probability >= 0.50 else 0
    return prediction, probability

def predict_single_url(url: str) -> dict:
    """Predict phishing status for a single URL."""
    features = extract_url_features(url)
    reasons = generate_risk_reasons(features)

    if is_model_loaded and model is not None:
        try:
            df_feat = pd.DataFrame([features])
            # Filter selected ReliefF features
            df_selected = df_feat[selected_features]
            # Scale features
            scaled_feat = scaler.transform(df_selected)
            # Predict probability
            prob_phishing = float(model.predict_proba(scaled_feat)[0][1])
            prediction = int(prob_phishing >= 0.5)
        except Exception as e:
            print(f"Prediction error, reverting to mock: {e}")
            prediction, prob_phishing = mock_rule_based_prediction(features)
    else:
        prediction, prob_phishing = mock_rule_based_prediction(features)

    risk_score = round(prob_phishing * 100, 2)
    label = "Phishing" if prediction == 1 else "Legitimate"

    return {
        "url": url,
        "classification": label,
        "risk_score": risk_score,
        "phishing_probability": round(prob_phishing, 4),
        "reasons": reasons,
        "features": features
    }

def predict_batch_urls(urls: list[str]) -> list[dict]:
    """Predict phishing status for a batch of URLs."""
    return [predict_single_url(u) for u in urls]