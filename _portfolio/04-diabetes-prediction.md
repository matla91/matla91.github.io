---
title: "Diabetes Risk Prediction — EDA-Driven ML"
excerpt: "Kaggle competition entry prioritizing rigorous EDA, calibration analysis, and clinical error profiling over leaderboard score. ROC-AUC 0.727 — consistent with the dataset's structural ceiling."
collection: portfolio
date: 2025-11-01
---

## Context & Problem

The Kaggle Playground Series S5E12 competition asks participants to predict diabetes risk from tabular medical and lifestyle data. Most participants optimize for leaderboard position. This project takes a deliberately different approach: treating the problem as a real-world applied ML exercise, where understanding data limitations, model calibration, and error profiles matters as much as the final metric.

## Data & Constraints

- **Source:** Kaggle Playground Series (synthetically generated data).
- **Size:** 700,000 training samples, 300,000 test samples. Binary classification target.
- **Features:** demographic (age, gender, ethnicity), lifestyle (physical activity, diet, sleep, smoking), and clinical proxies (BMI, blood pressure, cholesterol).
- **Critical limitation:** the dataset contains no primary causal biomarkers for diabetes (fasting glucose, HbA1c, insulin). All predictive power derives from indirect proxies, which imposes a hard ceiling on achievable performance.
- **Synthetic artifacts:** grid-like feature distributions and detectable covariate shift between train and test sets (confirmed via KS-tests).

## Methodology

- Conducted thorough EDA before any modeling: class overlap analysis, biological consistency checks (e.g., BMI vs. waist-to-hip ratio), synthetic artifact detection, and statistical covariate shift quantification.
- Identified a realistic ROC-AUC ceiling of ~0.72–0.73 from the EDA alone — before training any model.
- Trained a LightGBM classifier with strong regularization under 5-fold stratified cross-validation.
- Deliberately avoided aggressive feature engineering, hyperparameter over-optimization, and leaderboard probing — techniques that inflate apparent performance but do not reflect real-world generalization.

## Evaluation & Results

- **Out-of-fold ROC-AUC: 0.727**, with very low variance across CV folds.
- Performance is consistent with the ceiling predicted by EDA, confirming the bottleneck is data-driven (missing causal features), not model-driven.

**Interpretability and error analysis:**

- SHAP-based feature importance analysis.
- Clinical error profiling: false negatives concentrated in younger, lean patients; false positives biased toward older, higher-BMI profiles.
- ~16% of predictions identified as intrinsically ambiguous (high uncertainty region).
- Probability calibration analysis via reliability diagram and Brier score.

## Key Insights

- **EDA predicted the performance ceiling before modeling began.** The strong class overlap across all features, combined with the absence of causal biomarkers, made it clear that no model could substantially exceed ~0.73 ROC-AUC on this data.
- **Knowing when to stop optimizing is a skill.** Further gains would rely on exploiting synthetic data artifacts — not meaningful clinical signal. In a real healthcare context, this distinction is critical.
- **Error profiling reveals model blind spots.** The demographic bias in false negatives (missing diabetes in younger, lean patients) would be a serious deployment concern in a clinical setting. Reporting this matters more than reporting a marginal AUC improvement.
- **Calibration analysis is undervalued.** A model that returns well-calibrated probabilities is more useful in practice than one with a slightly higher AUC but poorly calibrated outputs.

## Links

- Kaggle Playground Series Season 5, Episode 12.
