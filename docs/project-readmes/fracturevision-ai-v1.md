<div align="center">
  <img src="https://img.icons8.com/nolan/256/x-ray.png" width="80" alt="FractureVision Logo"/>
  <h1>🦴 FractureVision AI</h1>
  <p><strong>Clinical-Grade Bone Fracture Classification System</strong></p>

[![Model: ViT-B/16](https://img.shields.io/badge/Model-ViT--B%2F16-blue?style=flat-square&logo=pytorch)](https://github.com/rwightman/pytorch-image-models)
[![Test Accuracy](https://img.shields.io/badge/Accuracy-99.01%25-success?style=flat-square)](#-model-results--performance-report)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61DAFB?style=flat-square&logo=react)](#-web-application)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](#-web-application)

</div>

<br/>

> **Techkriti Innovation Hackathon Submission**  
> An end-to-end medical deep learning pipeline utilizing state-of-the-art **Vision Transformers (ViT)** to automatically detect bone fractures from X-ray scans. It includes an interactive **Explainable AI (Grad-CAM)** overlay and a beautiful, modern **React+Tailwind CSS** clinical frontend dashboard.

---

## 📑 Table of Contents

1. [Project Report](#project-report)
2. [Model Results & Performance](#-model-results--performance-report)
3. [System Architecture](#-system-architecture)
4. [Web Application](#-web-application)
5. [Quick Start Guide](#-quick-start)
6. [Project Structure](#-project-structure)

---

## 🚀 Project Report

### Problem Statement

Bone fractures are among the most common traumatic injuries treated in hospitals globally. Rapid and accurate diagnosis from X-ray radiographs is crucial for effective patient care. However, manual interpretation is subjective, time-consuming, and prone to human error, especially in busy emergency rooms.

### Our Solution: FractureVision AI

We designed an advanced AI diagnostic assistant powered by a native **Vision Transformer (ViT-Base-16)**. Unlike traditional Convolutional Neural Networks (CNNs), the Transformer paradigm splits the X-ray into localized pixel patches, enabling it to dynamically learn global structural dependencies across the entire bone structure natively.

To solve the "black box" problem of Medical AI, we engineered an **Explainable AI (XAI)** pipeline using **Grad-CAM**. This visually highlights the exact fracture region the model focused on to make its prediction, building clinical trust.

---

## 🏆 Model Results & Performance Report

The model was rigorously evaluated on an unseen test set consisting of **506 clinical X-ray images**. It vastly outperformed the original PRD goal of ≥92%.

| Metric             | Score Achieved | Target Requirement |     Status      |
| :----------------- | :------------: | :----------------: | :-------------: |
| **Accuracy**       |   **99.01%**   |      ≥92.00%       |   ✅ Exceeded   |
| **Precision**      |   **99.05%**   |      ≥90.00%       |   ✅ Exceeded   |
| **Recall**         |   **98.97%**   |         -          |  ✅ Excellent   |
| **F1 Score**       |   **99.01%**   |      ≥90.00%       |   ✅ Exceeded   |
| **AUC-ROC**        |   **0.9990**   |         -          | ✅ Near Perfect |
| **Inference Time** | **~45 ms/img** |      < 100 ms      |   ✅ Exceeded   |

### Confusion Matrix Analysis

Out of 506 unseen patients, the model only missed **5** total cases:

- **True Fractured**: 234
- **True Not Fractured**: 267
- **False Negatives**: 4
- **False Positives**: 1

You can view the specific performance plots, ROC curves, and training history logs locally in the `/outputs/` directory.

### 🔍 Explainable AI (XAI) Error Analysis & Human-in-the-loop

Despite the **99.01% test accuracy**, no medical AI is perfect. To demonstrate this, there is a known False Negative within the dataset (`01.png` in the fractured test set). When passed through the system, the model confidently but incorrectly predicts "Not Fractured" directly.

**Why does this happen, and how does the UI solve it?**
When investigating this edge case using the **Grad-CAM XAI toggle** in the React dashboard, you can see the heatmap directly tracking the model's spatial attention. Because the model predicted "healthy", the Grad-CAM highlights the smooth, unblemished curve of the main joint that _convinced_ the model it was healthy, revealing that the AI completely missed tracking the subtle hairline fracture located just adjacent to it.

This explicitly demonstrates why AI in medicine must act as an **Assistant**, not an autonomous replacement. By instantly showing the doctor _where_ the AI looked, the doctor can immediately identify that the model focused on the wrong features for that specific scan and override the AI's False Negative diagnosis.

---

## 🧠 System Architecture

### 1. The Deep Learning Engine (`src/`)

- **Model:** ViT-Base/16 (via `timm`), initialized with ImageNet-21k weights.
- **Loss Function:** Weighted Cross-Entropy to statically resolve class imbalance.
- **Optimization:** AdamW optimizer + Cosine Annealing Learning Rate Scheduler with Warmups.
- **Speed:** Automated Mixed Precision (`torch.amp`) drastically reduces VRAM footprint.

### 2. The API Backend (`app.py`)

- **Framework:** FastAPI + Uvicorn
- **Capabilities:** Exposes a secure REST POST `/predict/` endpoint that decodes Base64/Multipart images on the fly, passes them through the inference tensor, and returns clinical JSON payloads. Base64-encoded Grad-CAM heatmaps are attached optionally.

### 3. The Clinic Dashboard (`frontend/`)

- **Tech Stack:** React (Vite), Tailwind CSS v3, Shadcn UI, Framer Motion, and Lucide Icons.
- **Design:** Advanced "Medical Glassmorphism" UI specifically designed for modern clinical software. Supports Drag & Drop, batch analysis pipelines, dynamic fractional-confidence loading bars, and embedded Grad-CAM overlays.

---

## 💻 Web Application

### Starting the Backend API

The FastAPI machine learning server must be running to process the frontend data.

```powershell
# Activate Python environment
.\venv\Scripts\Activate.ps1

# Spin up Uvicorn server (runs on Port 8000)
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Starting the React Frontend

Open a new terminal session, navigate to the `frontend` directory, and start Vite.

```powershell
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser to utilize the Clinical Dashboard.

---

## ⚙️ Quick Start (Training Pipeline)

If you wish to retrain the Vision Transformer from scratch:

**1. Install Dependencies**

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

**2. Run Pipeline Script**

```bash
python main.py
```

This script sequentially loads `config.yaml`, parses the Kaggle dataset, fires up the PyTorch `Trainer`, runs the evaluation on the test set, and dumps all artifacts (metrics, checkpoints, GradCAM charts) into `/outputs/`.

---

## 📁 Project Structure

```text
Bone_Fracture_Classification/
├── app.py                         # FastAPI Backend Server
├── config.yaml                    # Global hyperparameters
├── main.py                        # Automated training script
├── Bone_Fracture_Classification.ipynb # Hackathon EDA Notebook
│
├── frontend/                      # React UI Dashboard Application
│   ├── src/
│   │   ├── App.jsx                # Main Clinic View (Tailwind + Framer)
│   │   ├── index.css              # Custom shadcn UI theme vars
│   │   └── lib/                   # Utility functions
│   ├── tailwind.config.js         # Tailwind V3 configurations
│   └── package.json
│
├── src/                           # PyTorch ML Source Code
│   ├── data_loader.py             # Transforms & Automated balancing
│   ├── model.py                   # Model & Checkpointing logic
│   ├── train.py                   # PyTorch Training Loop
│   ├── evaluate.py                # AUC-ROC / F1 generators
│   ├── explainability.py          # ViT Grad-CAM Target Extractor
│   └── visualize.py               # Dark-mode chart plotter
│
├── checkpoints/                   # Checkpoints (.pth weights)
└── outputs/                       # Final deliverables (plots, CSVs)
```

<div align="center">
  <p>Built for the <strong>Xpecto'26 Hackathon</strong></p>
</div>
