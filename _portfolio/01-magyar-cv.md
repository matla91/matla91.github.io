---
title: "Industrial Image Classification — MAGYAR SA"
excerpt: "End-to-end CNN prototype for industrial tank categorization. 78% F1-score under real-world constraints: ~1,000 images, class imbalance, visually similar categories."
collection: portfolio
date: 2025-06-01
---

## Context & Problem

MAGYAR SA manufactures industrial tanks in a range of form factors that appear visually similar in photographs. The business need was to classify tank images automatically to support inventory and logistics workflows. This is a classic industrial computer vision problem: the gap between academic benchmarks (ImageNet, CIFAR) and real production data is enormous.

## Data & Constraints

- **Dataset size:** ~1,000 proprietary industrial images, collected, cleaned, labeled, and preprocessed from scratch.
- **Class imbalance:** some tank categories were significantly underrepresented.
- **Visual similarity:** several categories share near-identical silhouettes and differ only in subtle structural details.
- **Acquisition variability:** images were captured under inconsistent lighting, angles, and backgrounds — no controlled studio setup.
- **No public baseline:** no pre-existing benchmark or pretrained model exists for this specific industrial domain.

## Methodology

- Built the full pipeline from raw image collection through to inference: data curation, augmentation, model training, and evaluation.
- Used CNN architectures suited to small-dataset regimes, with transfer learning and data augmentation to mitigate the limited sample size.
- Evaluated using precision, recall, and F1-score per class — accuracy alone would have been misleading given the class imbalance.
- Collaborated in a two-person team, translating business requirements into concrete ML objectives and evaluation criteria.

## Evaluation & Results

- **78% macro F1-score** on the held-out test set.
- Delivered a functional offline prototype to the company.
- Performance was constrained primarily by data volume and inter-class visual similarity — not by model capacity.

## Key Insights

- With ~1,000 images and high visual similarity between classes, data quality and augmentation strategy matter far more than model architecture.
- F1-score (not accuracy) was the correct metric for this problem. Reporting accuracy would have masked poor performance on minority classes.
- Industrial CV problems rarely look like academic benchmarks. The hardest parts are data collection, labeling consistency, and managing stakeholder expectations around what ML can realistically achieve with limited data.
