import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import xgboost as xgb

# Import ReliefF from skrebate or fallback
try:
    from skrebate import ReliefF
except ImportError:
    from sklearn.feature_selection import SelectKBest, f_classif as ReliefF

DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "Phishing_Legitimate_full.csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def train():
    os.makedirs(MODELS_DIR, exist_ok=True)

    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        print("Please place 'Phishing_Legitimate_full.csv' inside the 'backend/data/' folder.")
        return

    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    target_col = "CLASS_LABEL"
    if target_col not in df.columns:
        print(f"Error: Target column '{target_col}' not found in dataset.")
        return

    X = df.drop(columns=[target_col])
    y = df[target_col]

    # Drop non-numeric or ID columns if any
    X = X.select_dtypes(include=[np.number])

    print(f"Initial Dataset Shape: {X.shape}")

    # 1. Min-Max Normalization
    print("Applying Min-Max Scaling...")
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns)

    # 2. ReliefF Feature Selection
    print("Performing ReliefF Feature Selection...")
    num_features_to_select = min(37, X.shape[1])
    
    try:
        relieff = ReliefF(n_features_to_select=num_features_to_select, n_neighbors=100, n_jobs=-1)
        relieff.fit(X_scaled, y.values)
        feature_scores = relieff.feature_importances_
        selected_indices = np.argsort(feature_scores)[::-1][:num_features_to_select]
    except Exception:
        print("Falling back to ANOVA F-score for feature selection...")
        selector = SelectKBest(score_func=ReliefF, k=num_features_to_select)
        selector.fit(X_scaled, y)
        selected_indices = selector.get_support(indices=True)

    selected_feature_names = list(X.columns[selected_indices])
    print(f"Selected Top {len(selected_feature_names)} Features: {selected_feature_names}")

    X_selected = X_scaled_df[selected_feature_names]

    # Refit Scaler on selected features only
    scaler_final = MinMaxScaler()
    scaler_final.fit(X[selected_feature_names])

    # 3. Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Train XGBoost Model
    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )
    model.fit(X_train, y_train)

    # 5. Evaluate Model
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    print("\n================ EVALUATION METRICS ================")
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1-Score  : {f1 * 100:.2f}%")
    print(f"ROC-AUC   : {auc * 100:.2f}%")
    print("Confusion Matrix:\n", cm)
    print("====================================================\n")

    # 6. Save Artifacts
    joblib.dump(model, os.path.join(MODELS_DIR, "xgboost_phishing_model.pkl"))
    joblib.dump(scaler_final, os.path.join(MODELS_DIR, "minmax_scaler.pkl"))
    joblib.dump(selected_feature_names, os.path.join(MODELS_DIR, "relieff_selected_features.pkl"))

    print("Model and artifacts saved successfully in 'backend/models/'!")

if __name__ == "__main__":
    train()