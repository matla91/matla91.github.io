---
title: "CNN Stock Prediction — A Reproducibility Study"
excerpt: "Independent reproduction of a Stanford paper claiming 91% accuracy for stock movement prediction. Under strict temporal validation, no model beat the naive baseline. 65,000+ views."
collection: portfolio
date: 2026-01-01
---

## Context & Problem

A widely cited Stanford paper reports CNN-based prediction accuracies as high as 91% for S&P 500 stock movements. These claims, if valid, would represent a significant result in financial ML. The goal of this project was to reproduce the results under a rigorous, leakage-free experimental protocol — and determine whether the reported performance holds up.

## Data & Constraints

- **Source:** Yahoo Finance (publicly available), ticker JPM (JP Morgan), daily data from 2005 to 2025.
- **Features:** 10 raw channels (OHLCV + adjusted OHLCV). No technical indicators or engineered features.
- **Sliding window:** 256 trading days as input, forecasting at T+30 horizon. Binary labels: BUY if future return > 0, SELL otherwise.
- **Critical constraint:** equity markets have a strong upward drift. A naive "always predict BUY" strategy achieves ~62.7% accuracy on the test set. Any model must significantly exceed this baseline to be considered informative.

## Methodology

- Reimplemented the full pipeline described in the original paper, including its specific normalization scheme and architecture (8-layer Conv1D with BatchNorm, LeakyReLU, Dropout).
- Enforced **strict temporal train/test split**: training on data before 2018, testing on 2018 onward. No shuffling across time.
- Applied **train-only normalization** to prevent any information leakage from the test period.
- Tested three model variants: a CNN baseline (2 Conv1D layers), the paper-like CNN, and a final controlled variant matching the paper's architecture as closely as possible.
- Compared all models against the explicit naive "always-BUY" baseline.

## Evaluation & Results

| Model | Train Accuracy | Test Accuracy |
|---|---|---|
| Naive Always-BUY | — | 62.7% |
| CNN Baseline | ~67% | 62.7% |
| Paper-like CNN | ~78% | 62.7% |
| Final Controlled CNN | ~83% | 62.7% |

All CNN models overfit the training data. None generalized beyond the naive baseline on unseen future data.

## Key Insights

- The most likely explanation for the original paper's 91% accuracy is **look-ahead bias**, probably caused by shuffling time-series data before splitting — a common but critical methodological error in financial ML.
- Increasing model depth and capacity improved training accuracy but had zero effect on out-of-sample performance. This is a textbook example of overfitting masquerading as learning.
- **Negative results under rigorous methodology are scientifically valuable.** The repository has been viewed over 65,000 times, suggesting real demand for honest evaluation in this space.
- Validation methodology matters more than model complexity. A naive baseline should be the first thing you compute, not an afterthought.

## Links

- [GitHub Repository](https://github.com/matla91/cnn-stock-prediction-reproducibility-study)
