---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

## Education

**Master's in Computer Science — Artificial Intelligence**
University of Quebec at Chicoutimi (UQAC), Canada — Expected January 2027

Coursework: Fundamentals of Machine Learning, Machine Learning for Big Data, Business Intelligence, Project Management.

**Engineering Degree — Computer Science & Network Engineering**
ENSISA, University of Haute-Alsace, France — Expected January 2027

Coursework: Deep Learning, Image Processing, Data Mining, Statistics, Cloud Computing, Software Engineering.

**Certification:** IBM — Apache Spark for Data Engineering and Machine Learning.

---

## Project Experience

**Industrial Image Classification — MAGYAR SA** (June 2025, Mulhouse, France)

Built an end-to-end offline CNN-based image classification prototype for industrial tank categorization. Constructed a proprietary dataset of ~1,000 images from scratch, handling collection, cleaning, labeling, and preprocessing. Achieved 78% F1-score under real-world constraints: class imbalance, visual similarity between categories, and variable acquisition conditions. Delivered the prototype as a two-person team, translating business requirements into ML objectives.

**CNN-Based Stock Prediction — Reproducibility Study** (January 2026, Chicoutimi, QC)

Conducted an independent reproduction of a Stanford paper reporting 91% accuracy for stock movement prediction using CNNs. Designed a leakage-free temporal evaluation framework with strict train/test splits, train-only normalization, and explicit naive baselines. Demonstrated that no model variant exceeded the 62.7% naive baseline on out-of-sample data, attributing the original results to look-ahead bias. The repository has reached 65,000+ views. [GitHub](https://github.com/matla91/cnn-stock-prediction-reproducibility-study)

**Large-Scale Sentiment Analysis — 1.6M Tweets** (November–December 2025, Chicoutimi, QC)

Designed and implemented a distributed sentiment analysis pipeline using PySpark on a Calcul Québec HPC cluster. Evaluated four feature engineering strategies with Approximate kNN and MinHash LSH. Achieved 0.854 accuracy on binary classification (Unigrammes, k=100) and demonstrated near-linear scalability with dataset size. Led the project end-to-end, focusing on Spark infrastructure and scalable ML algorithms.

**Diabetes Risk Prediction — Kaggle Playground Series** (November 2025)

Built an EDA-driven ML pipeline on 700K samples for diabetes risk prediction. Identified the performance ceiling (~0.73 ROC-AUC) from data analysis alone, before modeling. Trained a regularized LightGBM model achieving 0.727 ROC-AUC with clinical error profiling, SHAP interpretability, and calibration analysis. Prioritized methodological rigor over leaderboard optimization.

---

## Technical Skills

**Programming:** Python (NumPy, Pandas, Scikit-learn, PyTorch, TensorFlow/Keras), PySpark, C/C++, Java, SQL, Git, Linux.

**Machine Learning:** Supervised learning, CNNs, model evaluation (F1, ROC-AUC, calibration), generalization analysis, class imbalance handling, temporal validation, baseline methodology, reproducibility.

**NLP & Big Data:** Text preprocessing, n-gram features, Apache Spark (distributed ML), Approximate kNN, MinHash LSH.

**Data Science:** EDA, feature engineering, SHAP interpretability, statistical testing (KS-test, covariate shift detection), data augmentation.

**Mathematics:** Statistics, stochastic processes, numerical analysis, signal processing.

**Languages:** French (native), English (B2 — Linguaskill), German (B1 — Goethe-Test PRO).

---

## Availability

Seeking a 6-month ML Engineer internship starting July 2026.
Open to positions in Canada, USA, Switzerland, and France.
