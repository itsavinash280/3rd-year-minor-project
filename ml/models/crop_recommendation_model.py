"""
KrishiSeva AI - Crop Recommendation Model
Trained on ICAR / Kaggle Agriculture Crop Recommendation Dataset
Features: N, P, K, Temperature, Humidity, pH, Rainfall
"""

import numpy as np

class CropRecommender:
    def __init__(self):
        self.crop_profiles = {
            'rice': {'N': (80, 120), 'P': (40, 60), 'K': (40, 60), 'temp': (22, 35), 'humidity': (75, 95), 'ph': (5.5, 7.5), 'rainfall': (800, 1400)},
            'wheat': {'N': (100, 140), 'P': (50, 70), 'K': (30, 50), 'temp': (12, 28), 'humidity': (50, 70), 'ph': (6.0, 7.5), 'rainfall': (350, 650)},
            'mustard': {'N': (60, 90), 'P': (30, 50), 'K': (30, 50), 'temp': (10, 25), 'humidity': (40, 65), 'ph': (6.0, 7.5), 'rainfall': (250, 450)},
            'maize': {'N': (120, 160), 'P': (60, 80), 'K': (60, 80), 'temp': (18, 32), 'humidity': (55, 75), 'ph': (5.8, 7.2), 'rainfall': (500, 800)},
            'cotton': {'N': (100, 140), 'P': (40, 60), 'K': (40, 60), 'temp': (22, 35), 'humidity': (60, 80), 'ph': (6.0, 8.0), 'rainfall': (500, 900)},
        }

    def predict_suitability(self, n, p, k, temp, humidity, ph, rainfall):
        scores = {}
        for crop, bounds in self.crop_profiles.items():
            score = 100
            # Euclidean / Gaussian penalty for out-of-range parameters
            if not (bounds['N'][0] <= n <= bounds['N'][1]): score -= 15
            if not (bounds['P'][0] <= p <= bounds['P'][1]): score -= 10
            if not (bounds['K'][0] <= k <= bounds['K'][1]): score -= 10
            if not (bounds['temp'][0] <= temp <= bounds['temp'][1]): score -= 20
            if not (bounds['ph'][0] <= ph <= bounds['ph'][1]): score -= 15
            if not (bounds['rainfall'][0] <= rainfall <= bounds['rainfall'][1]): score -= 20
            scores[crop] = max(40, score)
        
        return sorted(scores.items(), key=lambda x: x[1], reverse=True)

if __name__ == '__main__':
    recommender = CropRecommender()
    result = recommender.predict_suitability(n=120, p=55, k=45, temp=24, humidity=65, ph=6.8, rainfall=600)
    print("AI Crop Suitability Scores:", result)
