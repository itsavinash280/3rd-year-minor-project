"""
Plant Leaf Disease Detection - PyTorch Deep Learning Pipeline
Supports MobileNetV3-Large and EfficientNet-B0 Transfer Learning

Usage:
  1. Train Model:
     python ml/models/plant_disease_pytorch_trainer.py --data_dir dataset --model mobilenet_v3 --epochs 15 --batch_size 32

  2. Evaluate on Test Set:
     python ml/models/plant_disease_pytorch_trainer.py --data_dir dataset --eval --checkpoint ml/models/saved/best_plant_disease_model.pth

  3. Predict a Single Leaf Image:
     python ml/models/plant_disease_pytorch_trainer.py --predict path/to/leaf_image.jpg --checkpoint ml/models/saved/best_plant_disease_model.pth
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from typing import Tuple, Dict, List

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import (
    mobilenet_v3_large, MobileNet_V3_Large_Weights,
    efficientnet_b0, EfficientNet_B0_Weights
)
from PIL import Image

# Setup Device (CUDA GPU -> MPS Apple Silicon -> CPU fallback)
def get_device() -> torch.device:
    if torch.cuda.is_available():
        device = torch.device('cuda')
        print(f"[Device] Using NVIDIA CUDA GPU: {torch.cuda.get_device_name(0)}")
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = torch.device('mps')
        print("[Device] Using Apple Silicon MPS GPU")
    else:
        device = torch.device('cpu')
        print("[Device] Using CPU (No GPU detected)")
    return device


# ==========================================
# 1. Model Architecture Builder
# ==========================================
def build_model(model_name: str = 'mobilenet_v3', num_classes: int = 38, pretrained: bool = True) -> nn.Module:
    """
    Builds and returns a fine-tuned transfer learning model (MobileNetV3 or EfficientNet-B0).
    """
    model_name = model_name.lower()
    
    if model_name in ['mobilenet_v3', 'mobilenet']:
        weights = MobileNet_V3_Large_Weights.DEFAULT if pretrained else None
        model = mobilenet_v3_large(weights=weights)
        in_features = model.classifier[3].in_features
        
        # Replace the final linear classification layer
        model.classifier[3] = nn.Sequential(
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(in_features, num_classes)
        )
        print(f"[Model] Initialized MobileNetV3-Large (in_features={in_features}, num_classes={num_classes})")
        
    elif model_name in ['efficientnet_b0', 'efficientnet']:
        weights = EfficientNet_B0_Weights.DEFAULT if pretrained else None
        model = efficientnet_b0(weights=weights)
        in_features = model.classifier[1].in_features
        
        # Replace the final linear classification layer
        model.classifier[1] = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, num_classes)
        )
        print(f"[Model] Initialized EfficientNet-B0 (in_features={in_features}, num_classes={num_classes})")
        
    else:
        raise ValueError(f"Unsupported model architecture: {model_name}. Choose 'mobilenet_v3' or 'efficientnet_b0'.")
        
    return model


# ==========================================
# 2. Data Transforms & Loaders
# ==========================================
def get_data_transforms() -> Dict[str, transforms.Compose]:
    """
    Returns data transformations for training (with data augmentation)
    and validation/testing (deterministic resizing + ImageNet normalization).
    """
    # ImageNet standard normalization constants
    norm_mean = [0.485, 0.456, 0.406]
    norm_std = [0.229, 0.224, 0.225]
    
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])
    
    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])
    
    return {
        'train': train_transform,
        'val': eval_transform,
        'test': eval_transform
    }


def create_dataloaders(data_dir: str, batch_size: int = 32, num_workers: int = 0) -> Tuple[Dict[str, DataLoader], List[str]]:
    """
    Loads ImageFolder datasets from data_dir/train, data_dir/validation (or val), and optionally data_dir/test.
    """
    data_path = Path(data_dir)
    train_dir = data_path / 'train'
    
    val_dir = data_path / 'validation'
    if not val_dir.exists():
        val_dir = data_path / 'val'
        
    test_dir = data_path / 'test'
    
    if not train_dir.exists():
        raise FileNotFoundError(f"Training directory not found at: {train_dir}")
        
    transforms_dict = get_data_transforms()
    
    train_dataset = datasets.ImageFolder(str(train_dir), transform=transforms_dict['train'])
    class_names = train_dataset.classes
    print(f"[Dataset] Found {len(class_names)} classes with {len(train_dataset)} training images.")
    
    dataloaders = {
        'train': DataLoader(
            train_dataset,
            batch_size=batch_size,
            shuffle=True,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        )
    }
    
    if val_dir.exists():
        val_dataset = datasets.ImageFolder(str(val_dir), transform=transforms_dict['val'])
        dataloaders['val'] = DataLoader(
            val_dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        )
        print(f"[Dataset] Found {len(val_dataset)} validation images.")
        
    if test_dir.exists():
        test_dataset = datasets.ImageFolder(str(test_dir), transform=transforms_dict['test'])
        dataloaders['test'] = DataLoader(
            test_dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=num_workers,
            pin_memory=torch.cuda.is_available()
        )
        print(f"[Dataset] Found {len(test_dataset)} test images.")
        
    return dataloaders, class_names


# ==========================================
# 3. Training & Evaluation Engine
# ==========================================
def train_model(
    model: nn.Module,
    dataloaders: Dict[str, DataLoader],
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    scheduler: torch.optim.lr_scheduler._LRScheduler,
    device: torch.device,
    num_epochs: int = 15,
    save_dir: str = 'ml/models/saved',
    class_names: List[str] = None
) -> nn.Module:
    """
    Executes the training loop with validation, metric tracking, and best model checkpointing.
    """
    os.makedirs(save_dir, exist_ok=True)
    best_model_path = os.path.join(save_dir, 'best_plant_disease_model.pth')
    mapping_path = os.path.join(save_dir, 'class_mapping.json')
    
    if class_names:
        with open(mapping_path, 'w') as f:
            json.dump({idx: name for idx, name in enumerate(class_names)}, f, indent=2)
        print(f"[Saved] Class mapping saved to: {mapping_path}")
        
    best_acc = 0.0
    start_time = time.time()
    
    print("\n" + "=" * 65)
    print(f" Starting PyTorch Training ({num_epochs} Epochs on {device})")
    print("=" * 65)
    
    for epoch in range(1, num_epochs + 1):
        print(f"\n--- Epoch {epoch}/{num_epochs} ---")
        
        # 1. Training Phase
        model.train()
        running_loss = 0.0
        running_corrects = 0
        total_samples = 0
        
        for batch_idx, (inputs, labels) in enumerate(dataloaders['train']):
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            _, preds = torch.max(outputs, 1)
            
            # Backward pass & optimization
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()
            total_samples += inputs.size(0)
            
            if (batch_idx + 1) % max(1, len(dataloaders['train']) // 5) == 0:
                print(f"  Step [{batch_idx + 1}/{len(dataloaders['train'])}] - Batch Loss: {loss.item():.4f}")
                
        epoch_train_loss = running_loss / total_samples
        epoch_train_acc = (running_corrects / total_samples) * 100.0
        print(f"  > Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.2f}%")
        
        # 2. Validation Phase (if available)
        if 'val' in dataloaders:
            model.eval()
            val_loss = 0.0
            val_corrects = 0
            val_total = 0
            
            with torch.no_grad():
                for inputs, labels in dataloaders['val']:
                    inputs = inputs.to(device)
                    labels = labels.to(device)
                    
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                    _, preds = torch.max(outputs, 1)
                    
                    val_loss += loss.item() * inputs.size(0)
                    val_corrects += torch.sum(preds == labels.data).item()
                    val_total += inputs.size(0)
                    
            epoch_val_loss = val_loss / val_total
            epoch_val_acc = (val_corrects / val_total) * 100.0
            print(f"  > Val Loss:   {epoch_val_loss:.4f} | Val Acc:   {epoch_val_acc:.2f}%")
            
            # Step the learning rate scheduler
            if scheduler:
                scheduler.step()
                
            # Save Best Model Checkpoint
            if epoch_val_acc > best_acc:
                best_acc = epoch_val_acc
                torch.save({
                    'epoch': epoch,
                    'model_state_dict': model.state_dict(),
                    'optimizer_state_dict': optimizer.state_dict(),
                    'best_acc': best_acc,
                    'class_names': class_names
                }, best_model_path)
                print(f"  [Checkpoint] Model saved with Validation Acc: {best_acc:.2f}% -> {best_model_path}")
        else:
            # If no val set, save last epoch model
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'train_acc': epoch_train_acc,
                'class_names': class_names
            }, best_model_path)
            
    elapsed_time = time.time() - start_time
    print("\n" + "=" * 65)
    print(f" Training Complete in {elapsed_time // 60:.0f}m {elapsed_time % 60:.0f}s | Best Val Acc: {best_acc:.2f}%")
    print(f" Best Checkpoint: {best_model_path}")
    print("=" * 65)
    
    return model


# ==========================================
# 4. Inference & Single Image Prediction
# ==========================================
def predict_image(
    image_path: str,
    checkpoint_path: str,
    model_name: str = 'mobilenet_v3',
    topk: int = 3
) -> List[Dict]:
    """
    Loads trained checkpoint and performs diagnostic inference on a single leaf image.
    """
    device = get_device()
    
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint file not found: {checkpoint_path}")
        
    checkpoint = torch.load(checkpoint_path, map_location=device)
    class_names = checkpoint.get('class_names')
    
    if not class_names:
        mapping_file = os.path.join(os.path.dirname(checkpoint_path), 'class_mapping.json')
        if os.path.exists(mapping_file):
            with open(mapping_file, 'r') as f:
                mapping = json.load(f)
                class_names = [mapping[str(i)] for i in range(len(mapping))]
        else:
            raise ValueError("Could not resolve class names list.")
            
    # Rebuild model
    model = build_model(model_name=model_name, num_classes=len(class_names), pretrained=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    model.eval()
    
    # Load and transform leaf image
    transforms_dict = get_data_transforms()
    image = Image.open(image_path).convert('RGB')
    tensor = transforms_dict['val'](image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        top_probs, top_indices = torch.topk(probabilities, k=min(topk, len(class_names)))
        
    results = []
    print(f"\nDiagnostic Predictions for: {image_path}")
    print("-" * 55)
    for i in range(len(top_probs)):
        idx = top_indices[i].item()
        prob = top_probs[i].item() * 100.0
        cls_name = class_names[idx]
        print(f" #{i + 1} | {cls_name} : {prob:.2f}% confidence")
        results.append({
            'rank': i + 1,
            'class': cls_name,
            'confidence': round(prob, 2)
        })
        
    return results


# ==========================================
# 5. CLI Entrypoint
# ==========================================
def main():
    parser = argparse.ArgumentParser(description="Plant Leaf Disease Detection - PyTorch Trainer & Classifier")
    parser.add_argument('--data_dir', type=str, default='dataset', help='Path to dataset directory containing train/val/test')
    parser.add_argument('--model', type=str, default='mobilenet_v3', choices=['mobilenet_v3', 'efficientnet_b0'], help='Model backbone architecture')
    parser.add_argument('--epochs', type=int, default=10, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size for training and validation')
    parser.add_argument('--lr', type=float, default=0.0001, help='Learning rate for Adam optimizer')
    parser.add_argument('--predict', type=str, default=None, help='Path to a single image to run disease prediction')
    parser.add_argument('--checkpoint', type=str, default='ml/models/saved/best_plant_disease_model.pth', help='Path to model weights checkpoint')
    
    args = parser.parse_args()
    
    if args.predict:
        # Prediction Mode
        predict_image(
            image_path=args.predict,
            checkpoint_path=args.checkpoint,
            model_name=args.model
        )
        return
        
    # Training Mode
    device = get_device()
    dataloaders, class_names = create_dataloaders(args.data_dir, batch_size=args.batch_size)
    
    model = build_model(model_name=args.model, num_classes=len(class_names), pretrained=True)
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    
    train_model(
        model=model,
        dataloaders=dataloaders,
        criterion=criterion,
        optimizer=optimizer,
        scheduler=scheduler,
        device=device,
        num_epochs=args.epochs,
        class_names=class_names
    )


if __name__ == '__main__':
    main()
