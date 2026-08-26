"""
Hugging Face PlantVillage Dataset Loader & Streamer
Dataset: mohanty/PlantVillage (https://huggingface.co/datasets/mohanty/PlantVillage)

Features:
- Stream and inspect 54,303 plant pathology leaf records from Hugging Face
- Parses 38 Pathology classes across 14 Agricultural and Horticultural crop species
- Direct integration with AsraVerse AI Plant Pathology Clinical Engine
"""

import sys
import os

def load_plantvillage_hf(streaming: bool = True, num_samples: int = 5):
    try:
        from datasets import load_dataset
    except ImportError:
        print("[Error] Hugging Face 'datasets' library is not installed.")
        print("Please install it using: pip install datasets")
        return

    # Import the diagnosis engine
    try:
        from models.plant_disease_plantvillage_cnn import PlantVillageClassifier
        classifier = PlantVillageClassifier()
    except Exception:
        classifier = None

    print("==================================================================")
    print(" HUGGING FACE DATASET LOADER: mohanty/PlantVillage")
    print(f" Mode: {'Streaming (Fast Preview)' if streaming else 'Full Download'}")
    print("==================================================================")

    try:
        print("\nConnecting to Hugging Face Hub (mohanty/PlantVillage)...")
        ds = load_dataset("mohanty/PlantVillage", "default", split="train", streaming=streaming)
        print("Successfully connected to stream!\n")

        print(f"--- Fetching & Diagnosing First {num_samples} Samples from Hugging Face Stream ---")
        for idx, sample in enumerate(ds.take(num_samples)):
            path_text = sample.get('text', '')
            parts = path_text.split('/')
            class_name = parts[2] if len(parts) >= 3 else parts[-1]
            crop_name = class_name.split('___')[0] if '___' in class_name else class_name
            disease_name = class_name.split('___')[1].replace('_', ' ') if '___' in class_name else 'N/A'

            print(f"\n* [Sample #{idx + 1}]")
            print(f"  - Record Path: {path_text}")
            print(f"  - Crop Species: {crop_name}")
            print(f"  - Plant Pathology: {disease_name}")
            print(f"  - Standard Class: {class_name}")

            if classifier:
                diag = classifier.diagnose(crop_name, disease_name)
                print(f"  - AI Severity: {diag['metadata']['severity']}")
                print(f"  - Recommended Chemical: {diag['metadata']['chemical_treatments'][0]}")
                print(f"  - Recommended Organic: {diag['metadata']['organic_treatments'][0]}")
            print("-" * 65)

        print("\n[SUCCESS] Hugging Face PlantVillage dataset is fully operational in AsraVerse AI!")

    except Exception as e:
        print(f"[Error loading dataset from Hugging Face]: {e}")
        print("\nTip: If offline, you can use the local PlantVillage classes and ML pipeline at:")
        print("ml/models/plant_disease_plantvillage_cnn.py")

if __name__ == '__main__':
    # Default to streaming mode for instant response
    is_stream = '--download' not in sys.argv
    samples = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 4
    load_plantvillage_hf(streaming=is_stream, num_samples=samples)
