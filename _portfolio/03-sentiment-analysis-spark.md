---
title: "Large-Scale Sentiment Analysis on 1.6M Tweets"
excerpt: "Distributed sentiment classification pipeline using PySpark, MinHash LSH, and Approximate kNN on Calcul Québec HPC. Near-linear scalability demonstrated across four feature engineering strategies."
collection: portfolio
date: 2025-12-01
---

## Context & Problem

Sentiment analysis at scale requires methods that handle both the volume of data and the high dimensionality of text representations. This project implemented and evaluated a distributed Approximate k-Nearest Neighbors (AkNN) classifier based on MinHash LSH for sentiment classification on the Sentiment140 dataset (1.6 million tweets), running on a Calcul Québec HPC cluster using PySpark.

The work was conducted as a graduate project for the course *Machine Learning for Big Data* (8INF919, UQAC) and reproduced the experimental framework from the paper *"Large Scale Sentiment Analysis on Twitter with Spark."*

## Data & Constraints

- **Dataset:** Sentiment140 — 1.6 million tweets labeled as Positive, Negative, or Neutral.
- **Infrastructure:** PySpark on Calcul Québec HPC cluster (distributed computing environment).
- **Dimensionality:** HashingTF vectors of dimension 262,144, compressed to 128-dimensional MinHash signatures.
- **Key challenge:** evaluating whether richer text representations (bigrams, lexical patterns) improve classification when using approximate similarity search, or whether they introduce noise that degrades performance.

## Methodology

Four feature engineering strategies were evaluated systematically:

- **S1 — Unigrammes:** individual words only.
- **S2 — Unigrammes + Bigrammes:** adding word pairs.
- **S3 — Patterns:** lexical patterns based on high-frequency and content words.
- **S4 — Full combination:** all of the above.

Each strategy was tested with k ∈ {50, 100, 150, 200} neighbors and numHashTables ∈ {128, 250}. Classification was performed using Spark MLlib's `approxNearestNeighbors` with MinHash LSH. An additional experiment replaced HashingTF with a Bloom Filter for vectorization.

Scalability was measured by running the pipeline on increasing fractions of the dataset and recording execution time.

## Evaluation & Results

**Binary classification (Positive vs. Negative):**

| Setup | Best Accuracy | Best k |
|---|---|---|
| S1 (Unigrammes) | **0.854** | 100 |
| S2 (Uni+Bigrammes) | 0.720 | 50 |
| S3 (Patterns) | 0.660 | 150 |
| S4 (Full combination) | 0.780 | 150 |

**Ternary classification (adding Neutral class):**

| Setup | Best Accuracy | Best k |
|---|---|---|
| S1 (Unigrammes) | 0.630 | 50 |
| S4 (Full combination) | **0.655** | 50 |

**Bloom Filter experiment (S1 binary):** accuracy dropped from 0.854 to 0.700, with a 6× increase in training time. False positives from the Bloom Filter corrupted MinHash signatures.

**Scalability:** near-linear growth in computation time with dataset size across all strategies, confirming the approach scales effectively under Spark's distributed execution.

## Key Insights

- **Simpler representations won for binary classification.** Unigrammes alone (S1) outperformed all richer feature sets. Adding bigrams and patterns increased dimensionality without improving — and sometimes degrading — the ability of MinHash LSH to preserve meaningful similarity.
- **Richer features helped for multi-class.** When the Neutral class was introduced, the full combination (S4) became necessary to capture subtler contextual signals. Features that acted as noise in binary became informative in ternary.
- **Bloom Filters were counterproductive here.** While theoretically appealing for memory reduction, the probabilistic false positives directly corrupted the hashing signatures that AkNN relies on. This is a concrete example of a theoretically sound technique failing in a specific algorithmic context.
- **Scalability held across all configurations.** The MinHash LSH + Spark combination maintained near-linear time complexity regardless of feature complexity, validating the approach for large-scale text classification.

## Links

- Project completed as part of 8INF919 (UQAC), December 2025.
