"""
Research-Grade Crop Recommendation Pipeline
Implementation of the peer-reviewed research paper:
'Machine learning based recommendation of agricultural and horticultural crop farming in India under the regime of NPK, soil pH and three climatic variables'
Published in: Heliyon 10 (2024) e25112 (Cell Press / Elsevier)
Authors: Biplob Dey, Jannatul Ferdous, Romel Ahmed

Features: N, P, K, Temperature, Humidity, pH, Rainfall
Models: XGBoost, Random Forest (RF), Support Vector Machine (SVM), Decision Tree (DT), K-Nearest Neighbors (KNN)
Pipelines:
  1. Agricultural Crops (AC - 11 crops)
  2. Horticultural Crops (HC - 11 crops)
  3. Combined / Mixed Crops (Co - 22 crops)
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
import xgboost as xgb

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'Crop_recommendation.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved')

# Crop Category Definitions from Heliyon (2024)
AGRICULTURAL_CROPS = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'jute', 'cotton'
]

HORTICULTURAL_CROPS = [
    'banana', 'watermelon', 'muskmelon', 'papaya', 'coffee',
    'pomegranate', 'mango', 'grapes', 'apple', 'orange', 'coconut'
]

class HeliyonCropMLPipeline:
    def __init__(self, data_path: str = DATASET_PATH):
        self.data_path = data_path
        os.makedirs(MODEL_DIR, exist_ok=True)
        self.df = pd.read_csv(self.data_path)
        self.trained_models = {}

    def get_models(self):
        """
        Hyperparameters configured exactly as published in Section 2.2 of the Heliyon (2024) study:
        - XGBoost: learning_rate=0.1, max_depth=17, n_estimators=200, subsample=0.5, gamma=0, random_state=50
        - Random Forest: max_depth=6, max_features=5, min_samples_split=4, random_state=0, n_estimators=15, criterion='entropy'
        - Decision Tree: max_depth=5, ccp_alpha=0.001, criterion='entropy', random_state=2
        - SVM: C=5, gamma=0.1, kernel='rbf', probability=True
        - KNN: k=3, metric='minkowski'
        """
        return {
            'XGBoost': xgb.XGBClassifier(
                learning_rate=0.1,
                max_depth=17,
                n_estimators=200,
                subsample=0.5,
                gamma=0,
                random_state=50,
                eval_metric='mlogloss',
            ),
            'Random Forest': RandomForestClassifier(
                n_estimators=15,
                max_depth=6,
                max_features=5,
                min_samples_split=4,
                criterion='entropy',
                random_state=0,
            ),
            'Decision Tree': DecisionTreeClassifier(
                max_depth=5,
                ccp_alpha=0.001,
                criterion='entropy',
                random_state=2,
            ),
            'SVM': SVC(
                C=5,
                gamma=0.1,
                kernel='rbf',
                probability=True,
                random_state=42,
            ),
            'KNN': KNeighborsClassifier(
                n_neighbors=3,
                metric='minkowski',
            ),
        }

    def train_and_evaluate_category(self, category_name: str, crop_filter=None):
        print(f"\n=======================================================")
        print(f" TRAINING PIPELINE: {category_name}")
        print(f"=======================================================")

        if crop_filter is not None:
            sub_df = self.df[self.df['label'].isin(crop_filter)].copy()
        else:
            sub_df = self.df.copy()

        features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        X = sub_df[features].values
        y_raw = sub_df['label'].values

        le = LabelEncoder()
        y = le.fit_transform(y_raw)

        # 70% Training / 30% Testing split as specified in Section 2.3 of the paper
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.30, random_state=42, stratify=y
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        results = []
        models = self.get_models()

        for model_name, model in models.items():
            # For tree-based models (XGBoost, RF, DT), raw features work best; for SVM/KNN, use scaled
            if model_name in ['SVM', 'KNN']:
                model.fit(X_train_scaled, y_train)
                preds = model.predict(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                preds = model.predict(X_test)

            acc = accuracy_score(y_test, preds) * 100
            prec = precision_score(y_test, preds, average='weighted', zero_division=0) * 100
            rec = recall_score(y_test, preds, average='weighted', zero_division=0) * 100
            f1 = f1_score(y_test, preds, average='weighted', zero_division=0) * 100

            results.append({
                'Model': model_name,
                'Accuracy (%)': round(acc, 2),
                'Precision (%)': round(prec, 2),
                'Recall (%)': round(rec, 2),
                'F1-score (%)': round(f1, 2),
            })

            # Save the trained XGBoost and RF models for production serving
            if model_name in ['XGBoost', 'Random Forest']:
                key = f"{category_name.lower().replace(' ', '_')}_{model_name.lower().replace(' ', '_')}"
                model_file = os.path.join(MODEL_DIR, f"{key}.pkl")
                with open(model_file, 'wb') as f:
                    pickle.dump({
                        'model': model,
                        'label_encoder': le,
                        'scaler': scaler,
                        'features': features,
                        'accuracy': acc,
                        'classes': le.classes_.tolist(),
                    }, f)

        res_df = pd.DataFrame(results)
        print(res_df.to_string(index=False))
        return res_df

    def run_all_benchmarks(self):
        print("\n--- Heliyon 2024 Benchmark Reproduction ---")
        ac_results = self.train_and_evaluate_category("Agricultural Crops (AC)", AGRICULTURAL_CROPS)
        hc_results = self.train_and_evaluate_category("Horticultural Crops (HC)", HORTICULTURAL_CROPS)
        co_results = self.train_and_evaluate_category("Mixed Crops (Co)", None)

        print("\n" + "="*70)
        print("SUMMARY COMPARISON (Table 1 Replication - Heliyon 2024)")
        print("="*70)
        combined_summary = []
        for i in range(len(ac_results)):
            model_name = ac_results.iloc[i]['Model']
            combined_summary.append({
                'Model': model_name,
                'AC Acc(%)': ac_results.iloc[i]['Accuracy (%)'],
                'HC Acc(%)': hc_results.iloc[i]['Accuracy (%)'],
                'Co Acc(%)': co_results.iloc[i]['Accuracy (%)'],
                'AC Prec(%)': ac_results.iloc[i]['Precision (%)'],
                'HC Prec(%)': hc_results.iloc[i]['Precision (%)'],
                'Co Prec(%)': co_results.iloc[i]['Precision (%)'],
            })
        print(pd.DataFrame(combined_summary).to_string(index=False))

    def predict(self, n: float, p: float, k: float, temp: float, humidity: float, ph: float, rainfall: float, category: str = 'all'):
        """
        Generates production predictions using the saved XGBoost / RF models.
        """
        category_lower = category.lower()
        if 'agri' in category_lower:
            model_path = os.path.join(MODEL_DIR, 'agricultural_crops_(ac)_xgboost.pkl')
        elif 'hort' in category_lower:
            model_path = os.path.join(MODEL_DIR, 'horticultural_crops_(hc)_xgboost.pkl')
        else:
            model_path = os.path.join(MODEL_DIR, 'mixed_crops_(co)_xgboost.pkl')

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Trained model not found at {model_path}. Please run training first.")

        with open(model_path, 'rb') as f:
            artifact = pickle.load(f)

        model = artifact['model']
        le = artifact['label_encoder']

        input_vec = np.array([[n, p, k, temp, humidity, ph, rainfall]])
        probs = model.predict_proba(input_vec)[0]

        top_indices = np.argsort(probs)[::-1]
        recommendations = []
        for idx in top_indices:
            crop = le.classes_[idx]
            confidence = round(float(probs[idx]) * 100, 2)
            if confidence > 1.0 or len(recommendations) < 3:
                recommendations.append({
                    'crop': crop,
                    'confidence': confidence,
                })

        return recommendations


if __name__ == '__main__':
    pipeline = HeliyonCropMLPipeline()
    pipeline.run_all_benchmarks()

    print("\n--- Testing Sample Prediction with XGBoost ---")
    sample = {'n': 90, 'p': 42, 'k': 43, 'temp': 20.8, 'humidity': 82.0, 'ph': 6.5, 'rainfall': 202.9}
    agri_preds = pipeline.predict(**sample, category='agricultural')
    print("Agricultural Recommendation:", agri_preds[:3])

    sample_horti = {'n': 24, 'p': 130, 'k': 195, 'temp': 29.9, 'humidity': 81.5, 'ph': 6.1, 'rainfall': 67.1}
    horti_preds = pipeline.predict(**sample_horti, category='horticultural')
    print("Horticultural Recommendation:", horti_preds[:3])
