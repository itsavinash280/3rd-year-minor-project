"""
AsraVerse AI - Crop Recommendation ML Model
Trained on the Kaggle Crop Recommendation Dataset (2,200 rows, 22 crop types)
Features: N (Nitrogen), P (Phosphorus), K (Potassium), Temperature (°C), Humidity (%), pH, Rainfall (mm)
"""

import os
import pandas as pd
import numpy as np

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'Crop_recommendation.csv')

class CropRecommendationML:
    def __init__(self, data_path: str = DATASET_PATH):
        self.data_path = data_path
        self.crop_stats = {}
        self.crops = []
        self.load_and_train()

    def load_and_train(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")

        df = pd.read_csv(self.data_path)
        self.crops = sorted(df['label'].unique().tolist())
        
        # Calculate mean and standard deviation per crop for Gaussian scoring
        for crop in self.crops:
            crop_df = df[df['label'] == crop]
            self.crop_stats[crop] = {
                'N_mean': float(crop_df['N'].mean()),
                'N_std': float(max(crop_df['N'].std(), 1.0)),
                'P_mean': float(crop_df['P'].mean()),
                'P_std': float(max(crop_df['P'].std(), 1.0)),
                'K_mean': float(crop_df['K'].mean()),
                'K_std': float(max(crop_df['K'].std(), 1.0)),
                'temp_mean': float(crop_df['temperature'].mean()),
                'temp_std': float(max(crop_df['temperature'].std(), 1.0)),
                'humidity_mean': float(crop_df['humidity'].mean()),
                'humidity_std': float(max(crop_df['humidity'].std(), 1.0)),
                'ph_mean': float(crop_df['ph'].mean()),
                'ph_std': float(max(crop_df['ph'].std(), 0.1)),
                'rainfall_mean': float(crop_df['rainfall'].mean()),
                'rainfall_std': float(max(crop_df['rainfall'].std(), 5.0)),
            }
        print(f"[CropRecommendationML] Successfully trained on {len(df)} records across {len(self.crops)} crops.")

    def predict_suitability(self, n: float, p: float, k: float, temp: float, humidity: float, ph: float, rainfall: float):
        """
        Calculates normalized suitability scores (0 - 100%) for all 22 crops based on Mahalanobis/Z-score proximity.
        """
        scores = {}
        for crop, stats in self.crop_stats.items():
            # Normalized Z-distance across all 7 agronomic dimensions
            z_n = ((n - stats['N_mean']) / stats['N_std']) ** 2
            z_p = ((p - stats['P_mean']) / stats['P_std']) ** 2
            z_k = ((k - stats['K_mean']) / stats['K_std']) ** 2
            z_t = ((temp - stats['temp_mean']) / stats['temp_std']) ** 2
            z_h = ((humidity - stats['humidity_mean']) / stats['humidity_std']) ** 2
            z_ph = ((ph - stats['ph_mean']) / stats['ph_std']) ** 2
            z_r = ((rainfall - stats['rainfall_mean']) / stats['rainfall_std']) ** 2

            distance = np.sqrt(z_n + z_p + z_k + z_t + z_h + z_ph + z_r)
            # Map distance to 0-100 score
            suitability = max(20.0, min(99.0, 100.0 * np.exp(-distance / 6.0)))
            scores[crop] = round(suitability, 1)

        return sorted(scores.items(), key=lambda x: x[1], reverse=True)


if __name__ == '__main__':
    ml = CropRecommendationML()
    sample_input = {
        'n': 90,
        'p': 42,
        'k': 43,
        'temp': 20.8,
        'humidity': 82.0,
        'ph': 6.5,
        'rainfall': 202.9
    }
    recommendations = ml.predict_suitability(**sample_input)
    print("\n--- Top 5 Crop Recommendations for sample input ---")
    for crop, score in recommendations[:5]:
        print(f"* {crop.capitalize():<12} | Suitability: {score}%")
