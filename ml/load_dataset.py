import kagglehub
from kagglehub import KaggleDatasetAdapter

# Download / load the latest version of the Crop Recommendation Dataset from Kaggle
print("Downloading / Loading dataset from Kaggle...")
try:
    df = kagglehub.load_dataset(
        KaggleDatasetAdapter.PANDAS,
        "atharvaingle/crop-recommendation-dataset",
        "",
    )
    print("\nDataset loaded successfully!")
    print("\nShape:", df.shape)
    print("\nFirst 5 records:\n", df.head())
    print("\nColumns:", list(df.columns))
except Exception as e:
    print(f"Error loading dataset: {e}")
