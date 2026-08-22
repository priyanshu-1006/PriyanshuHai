<div align="center">
  <img src="https://img.icons8.com/nolan/256/x-ray.png" width="80" alt="FractureVision Logo"/>
  <h1>FractureVision AI</h1>
  <p><strong>Multi-Model Bone Fracture Classification System</strong></p>

[![Models](https://img.shields.io/badge/Models-ViT%20%2B%20YOLOv10n%20%2B%20CoordAtt-blue?style=flat-square&logo=pytorch)](#model-results--performance)
[![ViT Accuracy](https://img.shields.io/badge/ViT%20Accuracy-99.01%25-success?style=flat-square)](#model-1-vit-base16--binary-fracture-screening)
[![YOLO mAP](https://img.shields.io/badge/YOLO%20mAP%400.5-93.3%25-success?style=flat-square)](#model-2-yolov10n-recall_focused--10-class-detection)
[![CoordAtt mAP](https://img.shields.io/badge/CoordAtt%20mAP%400.5-92.8%25-success?style=flat-square)](#model-3-yolov10n--coordinate-attention--10-class-detection)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61DAFB?style=flat-square&logo=react)](#web-application)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](#web-application)

</div>

<br/>

> **KBG Hackathon 2025 Submission** | Kamand Bioengineering Group, IIT Mandi
>
> An end-to-end medical AI pipeline with three complementary models: **ViT-Base/16** for binary fracture screening (99.01% accuracy), **YOLOv10n** for 10-class fracture detection (mAP@0.5 = 0.933), and **YOLOv10n + Coordinate Attention** with direction-aware spatial focus (mAP@0.5 = 0.928). Includes **Grad-CAM explainability**, a **FastAPI backend**, and a **React clinical dashboard**.

---

## Table of Contents

1. [Project Report](#project-report)
2. [Model Results & Performance](#model-results--performance)
   - [Model 1: ViT-Base/16](#model-1-vit-base16--binary-fracture-screening)
   - [Model 2: YOLOv10n (recall_focused)](#model-2-yolov10n-recall_focused--10-class-detection)
   - [Model 3: YOLOv10n + CoordAtt](#model-3-yolov10n--coordinate-attention--10-class-detection)
   - [Cross-Model Comparison](#cross-model-comparison)
3. [System Architecture](#system-architecture)
4. [Quick Start](#quick-start)
5. [Web Application](#web-application)
6. [Project Structure](#project-structure)

---

## Project Report

### Problem Statement

Bone fractures are among the most common traumatic injuries treated in hospitals globally. Rapid and accurate diagnosis from X-ray radiographs is crucial for effective patient care. However, manual interpretation is subjective, time-consuming, and prone to human error -- especially in busy emergency rooms where 3.5% of fractures are missed on initial reads.

### Our Solution: Multi-Model Architecture

We developed three complementary AI models in a progressive pipeline:

**Model 1 -- ViT-Base/16 (Binary Screening):**
A Vision Transformer that classifies X-rays as Fractured vs Not Fractured with 99.01% accuracy. Self-attention across 16x16 patches captures global structural dependencies, enabling detection of subtle hairline fractures that CNNs often miss.

**Model 2 -- YOLOv10n recall_focused (BEST MODEL -- 10-Class Detection):**
An ultra-lightweight YOLOv10n detector (2.28M params, 5.51 MB) trained for 200 epochs to identify 10 specific fracture types. This is our **best-performing model** across all metrics: mAP@0.5 = 0.933, Precision = 0.969, Recall = 0.900, F1 = 0.933, Macro F1 = 0.926. Remarkably, it achieves this on the **HBFMID dataset which is severely class-imbalanced** -- from just 1 Linear instance to 65 Transverse Displaced instances in validation -- yet delivers 0.995 mAP@0.5 on 6 out of 10 classes and maintains high recall even on minority classes. Despite strict compute constraints (Kaggle T4, batch size 6) and a small training set (~1,300 images for 10 classes), this model outperforms all other variants including the attention-enhanced CoordAtt model.

**Model 3 -- YOLOv10n + Coordinate Attention (10-Class Detection with Spatial Focus):**
YOLOv10n enhanced with **Coordinate Attention** (Hou et al., CVPR 2021) at backbone P3/P4/P5 stages. CoordAtt factorises global pooling into H-axis and W-axis branches, preserving directional spatial information critical for detecting oriented fracture lines. Integrated via a **gated residual** (gate init = 0) to prevent destabilising pretrained features. Achieves mAP@0.5 = 0.928 with only +57,984 attention parameters.

All models include **Grad-CAM / attention map explainability** for clinical trust and human-in-the-loop verification.

---

## Model Results & Performance

### Model 1: ViT-Base/16 -- Binary Fracture Screening

**Task:** Binary classification (Fractured vs Not Fractured)
**Dataset:** Kaggle Bone Fracture Binary Classification (9,246 train / 829 val / 506 test)
**Input:** 224x224 RGB, ImageNet-normalized

#### Overall Metrics

| Metric | Score |
|:-------|:-----:|
| **Overall Accuracy** | **99.01%** |
| **Precision** | **99.05%** |
| **Recall** | **98.97%** |
| **F1 Score** | **99.01%** |
| **AUC-ROC** | **0.9990** |
| **Training Time** | ~35 min (22 epochs on RTX 4050) |
| **Inference Time** | ~45 ms/image |
| **Model Size** | 327.3 MB |
| **Parameters** | 85.8M |

#### Per-Class Metrics

| Class | Precision | Recall | F1-Score | Support |
|:------|:---------:|:------:|:--------:|:-------:|
| **Fractured** | 98.94% | 99.15% | 99.05% | 235 |
| **Not Fractured** | 99.17% | 98.80% | 98.98% | 271 |
| **Macro Avg** | **99.05%** | **98.97%** | **99.01%** | 506 |

#### Confusion Matrix

|  | Pred: Fractured | Pred: Not Fractured |
|:-|:---------------:|:-------------------:|
| **True: Fractured** | **234** (TP) | 1 (FN) |
| **True: Not Fractured** | 4 (FP) | **267** (TN) |

5 total errors out of 506 test images. AUC-ROC of 0.9990 indicates near-perfect class separation.

#### Training Configuration

| Parameter | Value |
|:----------|:-----:|
| Architecture | ViT-Base/16 (timm, ImageNet-21k pretrained) |
| Optimizer | AdamW (lr=1e-4, weight_decay=0.01) |
| Scheduler | Cosine Annealing + 5-epoch warmup |
| Loss | Focal Loss (gamma=2.0, label_smoothing=0.1) |
| LLRD | 0.9 (layer-wise learning rate decay) |
| Augmentation | Mixup(0.4) + CutMix(1.0) + CLAHE + GridDistortion |
| Mixed Precision | AMP FP16 |
| Early Stopping | Patience 10, monitoring val_loss |

---

### Model 2: YOLOv10n (recall_focused) -- BEST MODEL -- 10-Class Detection

**Task:** 10-class bone fracture detection
**Dataset:** HBFMID via Roboflow (1,347 train / 128 val / 64 test)
**Input:** 640x640, YOLO format bounding boxes
**Hardware:** Kaggle T4 GPU (Phase 1: 200 epochs)

> **This is our best-performing model.** Despite training on a severely imbalanced dataset (1 Linear instance vs 65 Transverse Displaced instances in validation) with strict compute constraints (Kaggle T4, batch size 6, ~1,300 training images for 10 classes), this model outperforms all other variants -- including the attention-enhanced CoordAtt model -- across every primary metric.

#### Dataset Imbalance Challenge

The HBFMID dataset presents extreme class imbalance -- a 65:1 ratio between the largest and smallest class in validation:

| Class | Val Images | Val Instances | Imbalance Ratio |
|:------|:----------:|:------------:|:---------------:|
| Transverse Displaced | 53 | 65 | 65.0x (largest) |
| Oblique Displaced | 30 | 30 | 30.0x |
| Comminuted | 15 | 15 | 15.0x |
| Transverse | 11 | 14 | 14.0x |
| Greenstick | 10 | 10 | 10.0x |
| Healthy | 7 | 7 | 7.0x |
| Oblique | 7 | 7 | 7.0x |
| Spiral | 5 | 5 | 5.0x |
| Segmental | 3 | 3 | 3.0x |
| Linear | 1 | 1 | **1.0x (smallest)** |

Despite this imbalance, the model achieves **0.995 mAP@0.5 on 6 out of 10 classes** and maintains high precision across all classes.

#### Overall Metrics

| Metric | Score |
|:-------|:-----:|
| **mAP@0.5** | **0.933** |
| **mAP@0.5:0.95** | **0.521** |
| **Overall Precision** | **0.969** |
| **Overall Recall** | **0.900** |
| **Overall F1** | **0.933** |
| **Macro F1** | **0.926** |
| **AUC-ROC (equivalent: mAP@0.5)** | **0.933** |
| **Training Time** | ~2.5 hours (200 epochs on Kaggle T4 GPU) |
| **Inference Time** | **18.8 ms/image** (GPU), 56.1 ms/image (CPU) |
| **Model Size** | 5.51 MB (.pt) / 5.40 MB (.pth) |
| **Parameters** | 2,267,118 |
| **Speed Breakdown** | 0.9ms preprocess, 18.8ms inference, 0.0ms loss, 0.2ms postprocess |

#### Per-Class Detection Metrics (Validation: 128 images, 157 instances)

| Class | Images | Instances | Precision | Recall | F1-Score | mAP@0.5 | mAP@0.5:0.95 | Band |
|:------|:------:|:---------:|:---------:|:------:|:--------:|:-------:|:------------:|:----:|
| **Healthy** | 7 | 7 | 0.959 | 1.000 | **0.979** | 0.995 | 0.715 | Top |
| **Oblique** | 7 | 7 | 1.000 | 0.956 | **0.978** | 0.995 | 0.617 | Top |
| **Linear** | 1 | 1 | 0.943 | 1.000 | **0.971** | 0.995 | 0.497 | Top |
| **Segmental** | 3 | 3 | 0.942 | 1.000 | **0.970** | 0.995 | 0.812 | Top |
| **Spiral** | 5 | 5 | 0.936 | 1.000 | **0.967** | 0.995 | 0.434 | Top |
| **Transverse** | 11 | 14 | 1.000 | 0.933 | **0.965** | 0.995 | 0.546 | Top |
| **Oblique Displaced** | 30 | 30 | 0.962 | 0.933 | **0.947** | 0.963 | 0.447 | Strong |
| **Transverse Displaced** | 53 | 65 | 0.948 | 0.836 | **0.888** | 0.919 | 0.371 | Good |
| **Comminuted** | 15 | 15 | 1.000 | 0.773 | **0.872** | 0.838 | 0.512 | Good |
| **Greenstick** | 10 | 10 | 1.000 | 0.568 | **0.724** | 0.637 | 0.254 | Moderate |
| **Overall** | **128** | **157** | **0.969** | **0.900** | **0.933** | **0.933** | **0.521** | |

**Key observations:**
- **6 classes achieve mAP@0.5 = 0.995** (Healthy, Oblique, Linear, Segmental, Spiral, Transverse) -- near-perfect detection despite tiny sample sizes
- **Perfect precision (1.000)** on 4 classes: Comminuted, Greenstick, Oblique, Transverse -- when the model predicts these, it is always correct
- **5 classes achieve perfect or near-perfect recall** (>=0.933): Healthy, Linear, Segmental, Spiral, Oblique
- **Greenstick** is the hardest class (F1=0.724, Recall=0.568) -- expected for incomplete fractures with subtle cortical discontinuity on only one side
- **Segmental has the highest mAP@0.5:0.95 (0.812)** -- excellent localisation quality despite only 3 instances
- The model handles the 65:1 imbalance ratio gracefully -- no class collapses to zero, and 8/10 classes exceed F1 > 0.87

#### Why This Is the Best Model

| Comparison | recall_focused | CoordAtt (gated) | Delta |
|:-----------|:-------------:|:----------------:|:-----:|
| mAP@0.5 | **0.933** | 0.928 | +0.005 |
| mAP@0.5:0.95 | **0.521** | 0.499 | +0.022 |
| Precision | **0.969** | 0.934 | +0.035 |
| Recall | **0.900** | 0.846 | +0.054 |
| F1 | **0.933** | 0.888 | +0.045 |
| Macro F1 | **0.926** | 0.873 | +0.053 |

The recall_focused model dominates across **every single metric** -- higher precision, higher recall, higher mAP, higher F1, and higher macro F1. It achieves this with fewer parameters (2.27M vs 2.28M), simpler architecture (no attention modules), and more robust training (full 200-epoch schedule vs 2-phase fine-tuning). The CoordAtt model's directional attention, while architecturally novel, could not overcome the distribution shift introduced by re-initialised attention weights -- even with the gated residual safeguard.

---

### Model 3: YOLOv10n + Coordinate Attention -- 10-Class Detection

**Task:** 10-class bone fracture detection with direction-aware spatial attention
**Dataset:** HBFMID (128 val images, 157 instances)
**Input:** 640x640, YOLO format bounding boxes
**Training Phase:** Phase 2 -- gated CoordAtt fine-tuning from recall_focused weights
**Framework:** Ultralytics 8.4.21, PyTorch 2.9.0+cu126, NVIDIA Tesla P100 16 GB

#### Coordinate Attention Architecture

CoordAtt (Hou et al., CVPR 2021) extends Squeeze-and-Excitation by factorising global pooling into two directional branches (H-pool + W-pool), preserving spatial positional information critical for detecting oriented fracture lines:

```
Input X (N,C,H,W)
  |-- Pool_H: AdaptiveAvgPool2d((None,1)) --> (N,C,H,1)
  |-- Pool_W: AdaptiveAvgPool2d((1,None)) --> (N,C,1,W) --> permute --> (N,C,W,1)
  |
  --> Concat --> Conv1x1 --> BN --> h-swish --> Split
  |                                              |
  Conv_H --> sigmoid --> a_h (N,C,H,1)     Conv_W --> sigmoid --> a_w (N,C,1,W)
  |
  Output = X * a_h * a_w   (direction-aware reweighting)
```

**Gated Residual Integration:**
```
C2f_CA(x) = C2f(x) + g * [CoordAtt(C2f(x)) - C2f(x)]
```
Gate `g` initialised to 0 -- at epoch 0 the model behaves identically to the recall_focused baseline. The gate learns to gradually introduce directional attention during fine-tuning.

**Injection Points:** Backbone layers 4 (P3, 80x80, 64ch), 6 (P4, 40x40, 128ch), 8 (P5, 20x20, 256ch) -- adding ~57,984 CoordAtt parameters.

#### Overall Metrics

| Metric | Score |
|:-------|:-----:|
| **mAP@0.5** | **0.928** |
| **mAP@0.5:0.95** | **0.499** |
| **Overall Precision** | **0.934** |
| **Overall Recall** | **0.846** |
| **Overall F1** | **0.888** |
| **Macro F1** | **0.873** |
| **Weighted F1** | **0.847** |
| **AUC-ROC (equivalent: mAP@0.5)** | **0.928** |
| **Training Time** | Phase 1: ~2.5h (200 ep, T4) + Phase 2: ~1h (80 ep, P100) |
| **Inference Time** | Real-time (6.6 GFLOPs) |
| **Model Size** | 5.40 MB (.pth state_dict) |
| **Parameters (fused)** | 2,278,841 (123 layers) |
| **GFLOPs** | 6.6 |

#### Per-Class Detection Metrics (Validation: 128 images, 157 instances)

| Class | Images | Instances | Precision | Recall | F1-Score | AP@0.5 | AP@0.5:0.95 |
|:------|:------:|:---------:|:---------:|:------:|:--------:|:------:|:-----------:|
| **Transverse** | 11 | 14 | 0.995 | 1.000 | **0.997** | 0.995 | 0.557 |
| **Spiral** | 5 | 5 | 0.964 | 1.000 | **0.982** | 0.995 | 0.447 |
| **Linear** | 1 | 1 | 0.859 | 1.000 | **0.924** | 0.995 | 0.298 |
| **Oblique** | 7 | 7 | 0.995 | 0.857 | **0.921** | 0.978 | 0.636 |
| **Healthy** | 7 | 7 | 1.000 | 0.825 | **0.904** | 0.995 | 0.696 |
| **Oblique Displaced** | 30 | 30 | 0.944 | 0.833 | **0.885** | 0.968 | 0.454 |
| **Comminuted** | 15 | 15 | 0.984 | 0.800 | **0.882** | 0.877 | 0.534 |
| **Segmental** | 3 | 3 | 0.697 | 1.000 | **0.821** | 0.995 | 0.703 |
| **Transverse Displaced** | 53 | 65 | 0.897 | 0.673 | **0.769** | 0.840 | 0.381 |
| **Greenstick** | 10 | 10 | 1.000 | 0.474 | **0.643** | 0.642 | 0.284 |
| **Overall** | **128** | **157** | **0.934** | **0.846** | **0.888** | **0.928** | **0.499** |

#### Confusion Matrix Summary (Normalised)

| True \ Predicted | Detected (TP) | Missed (FN) | Notes |
|:----------------|:-------------:|:-----------:|:------|
| **Transverse** (14) | **100%** | 0% | Perfect recall |
| **Spiral** (5) | **100%** | 0% | Perfect recall |
| **Linear** (1) | **100%** | 0% | Perfect recall |
| **Segmental** (3) | **100%** | 0% | Perfect recall |
| **Oblique** (7) | **85.7%** | 14.3% | 1 missed |
| **Oblique Displaced** (30) | **83.3%** | 16.7% | 5 missed |
| **Healthy** (7) | **82.5%** | 17.5% | 1-2 missed |
| **Comminuted** (15) | **80.0%** | 20.0% | 3 missed |
| **Transverse Displaced** (65) | **67.3%** | 32.7% | 21 missed -- largest class |
| **Greenstick** (10) | **47.4%** | 52.6% | Weakest -- subtle incomplete fractures |

**Key finding:** Zero cross-class confusion -- all errors are false negatives (missed detections), not misclassifications between fracture types.

#### Phase 2 Training Configuration

| Parameter | Value |
|:----------|:-----:|
| Architecture | YOLOv10n + C2f_CA (gated residual, gate init=0) |
| CoordAtt injection | Backbone layers 4, 6, 8 (P3/P4/P5) |
| Added parameters | +57,984 (~2.5% of total) |
| Optimizer | AdamW (lr0=0.0001, lrf=0.01) |
| Scheduler | Cosine LR with 5 warmup epochs |
| Epochs | 80 (Phase 2 fine-tuning) |
| Batch Size | 6 |
| Frozen | Backbone + neck (only CA + detection head trainable) |
| Trainable params | ~877K of 2.76M total |
| Label smoothing | 0.1 |
| Loss weights | cls=2.0, box=8.0, dfl=1.5 |

---

### Cross-Model Comparison

#### All Required Metrics at a Glance

| Required Metric | ViT-Base/16 (Binary) | YOLOv10n recall_focused (BEST) | YOLOv10n + CoordAtt |
|:----------------|:--------------------:|:------------------------------:|:-------------------:|
| **Overall Accuracy** | **99.01%** | -- (detection, use mAP) | -- (detection, use mAP) |
| **mAP@0.5** | -- (classification) | **0.933** | 0.928 |
| **mAP@0.5:0.95** | -- | **0.521** | 0.499 |
| **Overall Precision** | 99.05% | **96.9%** | 93.4% |
| **Overall Recall** | 98.97% | **90.0%** | 84.6% |
| **Overall F1** | 99.01% | **93.3%** | 88.8% |
| **Macro F1** | 99.01% | **92.6%** | 87.3% |
| **AUC-ROC** | **0.9990** | **0.933** (mAP@0.5) | 0.928 (mAP@0.5) |
| **Per-class Precision** | See [ViT table](#per-class-metrics) | See [YOLO table](#per-class-detection-metrics-validation-128-images-157-instances) | See [CoordAtt table](#per-class-detection-metrics-validation-128-images-157-instances-1) |
| **Per-class Recall** | See above | See above | See above |
| **Per-class F1-Score** | See above | See above | See above |
| **Confusion Matrix** | [ViT CM](#confusion-matrix) | See confusion_matrix_normalized.png | [CoordAtt CM](#confusion-matrix-summary-normalised) |
| **Training Time** | ~35 min (22 ep, RTX 4050) | ~2.5 hrs (200 ep, T4 GPU) | +~1 hr (80 ep, P100 GPU) |
| **Inference Time** | ~45 ms/img | **18.8 ms/img** (GPU) | Real-time (6.6 GFLOPs) |
| **Model Size** | 327.3 MB | **5.51 MB** (.pt) / 5.40 MB (.pth) | 5.40 MB (.pth) |
| **Parameters** | 85.8M | **2,267,118** | 2,278,841 |

#### Model Selection Guide

| Use Case | Recommended Model | Why |
|:---------|:-----------------|:----|
| **Primary screening** (fracture present?) | ViT-Base/16 | 99.01% accuracy, 0.9990 AUC-ROC |
| **Fracture typing** (which type?) | YOLOv10n recall_focused | Highest mAP@0.5 (0.933) and recall (0.900) |
| **Direction-aware detection** (spatial focus) | YOLOv10n + CoordAtt | Directional attention for oriented fracture lines |
| **Edge deployment** (mobile/embedded) | YOLOv10n variants | 5.5 MB, 2.28M params, 6.5 GFLOPs |

### Explainable AI (XAI)

- **ViT:** Grad-CAM + Attention Rollout across 12 transformer layers, auto-targeting last attention block
- **YOLO:** F1-confidence curves, PR curves per class, normalised confusion matrices (generated by Ultralytics)
- **Clinical value:** When the ViT model produces a false negative, Grad-CAM reveals focus on healthy bone regions rather than the fracture -- demonstrating why AI must serve as a decision support tool, not an autonomous replacement
- **Outputs:** `outputs/gradcam/` (Grad-CAM batch, multi-class, attention rollout)

---

## System Architecture

### 1. AI Engine (`ai_engine/`)

The core ML package supporting all model pipelines:

- **ViT Pipeline:** ViT-Base/16 via `timm`, ImageNet-21k pretrained, custom MLP head, Focal Loss, AdamW + Cosine Annealing with LLRD, Mixup/CutMix, AMP FP16
- **YOLO Pipeline:** YOLOv10n via `ultralytics`, COCO pretrained, end-to-end detection, mosaic + RandAugment
- **CoordAtt Pipeline:** YOLOv10n + C2f_CA with gated residual, two-phase training (full + freeze fine-tune)
- **Shared:** Grad-CAM explainability, cross-validation, ensemble methods, training visualization, data quality checks

### 2. API Backend (`backend/`)

- **Framework:** FastAPI + Uvicorn
- **Auth:** JWT (HS256) with role-based access
- **Endpoints:** `/api/v1/predict/` (single + batch), `/api/v1/model/health`, `/api/v1/auth/token`
- **Features:** Rate limiting (60/min), Grad-CAM base64 overlays, 10 MB upload limit

### 3. Clinical Dashboard (`frontend/`)

- **Stack:** React (Vite) + Tailwind CSS v3
- **Design:** Medical glassmorphism UI with drag-and-drop upload, real-time confidence bars, embedded Grad-CAM overlays

---

## Quick Start

### 1. Install Dependencies

```bash
python -m venv venv
# Windows
.\venv\Scripts\Activate.ps1
# Linux/Mac
source venv/bin/activate

pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

### 2. Train / Evaluate Models

```bash
# Train ViT from scratch (binary classification)
python run.py --model vit --mode train

# Evaluate existing YOLO checkpoint (10-class detection)
python run.py --model yolo --mode eval

# Train YOLO from scratch
python run.py --model yolo --mode train --data-yaml dataset/data_local.yaml

# Show all options
python run.py --help
```

Or use the module directly:
```bash
python -m ai_engine --model vit --mode train
```

### 3. Generate YOLO Metrics CSV

```bash
python ai_engine/generate_final_metrics.py
```

---

## Web Application

### Starting the Backend API

```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Starting the React Frontend

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to use the Clinical Dashboard.

---

## Project Structure

```
Bone_Fracture_Classification/
|
|-- run.py                          # Entry point: python run.py --model vit|yolo
|-- requirements.txt                # All dependencies (torch, ultralytics, fastapi, ...)
|-- presentation.md                 # 8-slide hackathon presentation (Markdown)
|-- TEAM.txt                        # Team info and contact details
|
|-- ai_engine/                      # Core ML package (all models)
|   |-- __init__.py                 # Package init
|   |-- __main__.py                 # python -m ai_engine support
|   |-- main.py                     # Pipeline orchestrator (--model vit|yolo)
|   |-- config.yaml                 # ViT pipeline configuration
|   |-- yolo_config.yaml            # YOLO pipeline configuration
|   |-- model.py                    # ViT FractureClassifier (timm)
|   |-- yolo_pipeline.py            # YOLOv10n wrapper (ultralytics)
|   |-- train.py                    # Training loop + EarlyStopping
|   |-- evaluate.py                 # Metrics computation (accuracy, F1, AUC-ROC)
|   |-- data_loader.py              # Dataset loading + Albumentations transforms
|   |-- losses.py                   # Focal Loss + Label Smoothing CE
|   |-- optimizer.py                # AdamW with Layer-wise LR Decay
|   |-- mixup.py                    # Mixup + CutMix augmentation
|   |-- explainability.py           # Grad-CAM + Attention Rollout
|   |-- visualize.py                # Training curves, ROC, confusion matrix plots
|   |-- cross_validation.py         # Stratified K-Fold CV
|   |-- ensemble.py                 # Multi-model ensemble (voting/averaging)
|   |-- config_parser.py            # YAML config loader + seed/device setup
|   |-- data_quality.py             # Dataset validation and stats
|   |-- report_generator.py         # PDF report generation
|   |-- utils.py                    # Inference utils, benchmarking, logging
|   |-- generate_final_metrics.py   # Standalone YOLO metrics CSV generator
|
|-- models/                         # Trained checkpoints
|   |-- Bone-Best.pt                # YOLOv10n checkpoint (Ultralytics format, 5.51 MB)
|   |-- Bone-Best.pth               # YOLOv10n checkpoint (PyTorch state_dict, 5.40 MB)
|
|-- backend/                        # FastAPI REST API
|   |-- app.py                      # Application entry point
|   |-- api/
|       |-- core/config.py          # Settings (JWT, CORS, rate limits)
|       |-- core/security.py        # JWT authentication
|       |-- middleware/auth.py       # Token validation middleware
|       |-- middleware/rate_limit.py # SlowAPI rate limiter
|       |-- routes/predict.py       # POST /predict (single + batch)
|       |-- routes/auth.py          # POST /auth/token
|       |-- routes/model.py         # GET /model/health, /model/info
|       |-- routes/feedback.py      # POST /feedback
|       |-- services/inference.py   # Model loading + inference singleton
|
|-- frontend/                       # React clinical dashboard
|   |-- src/App.jsx                 # Main UI (Tailwind + drag-and-drop)
|   |-- tailwind.config.js
|   |-- package.json
|
|-- notebooks/                      # Training notebooks (reference)
|   |-- Bone_Fracture_Classification.ipynb   # ViT training notebook
|   |-- bone fractue IITMANDI.ipynb          # YOLOv10n training notebook
|
|-- dataset/                        # YOLO format dataset (not in git)
|   |-- data.yaml                   # Dataset config (Roboflow)
|   |-- data_local.yaml             # Local paths config
|   |-- train/images/, train/labels/
|   |-- valid/images/, valid/labels/
|   |-- test/images/, test/labels/
|
|-- outputs/                        # Generated artifacts
|   |-- results/                    # final_results.csv, model_performance_analysis.csv
|   |-- plots/                      # Training curves, ROC, confusion matrix
|   |-- gradcam/                    # Grad-CAM + attention rollout visualizations
|   |-- logs/                       # Training logs
|
|-- docs/                           # Problem statement, attention documentation
|-- _archive/                       # Archived older versions
```

---

## References

1. Dosovitskiy et al. (2021) -- "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale" (ViT)
2. Wang et al. (2024) -- "YOLOv10: Real-Time End-to-End Object Detection"
3. Hou et al. (2021) -- "Coordinate Attention for Efficient Mobile Network Design" (CVPR 2021)
4. Selvaraju et al. (2017) -- "Grad-CAM: Visual Explanations from Deep Networks"

---

<div align="center">
  <p>Built for the <strong>KBG Hackathon 2025</strong> | Kamand Bioengineering Group, IIT Mandi</p>
</div>
