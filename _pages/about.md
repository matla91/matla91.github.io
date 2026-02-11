---
permalink: /
title: "About"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

I am an applied Machine Learning engineer currently completing a dual degree — an Engineering Degree in Computer Science (ENSISA, France) and a Master's in Artificial Intelligence (UQAC, Canada). My work focuses on building ML systems that perform reliably under real-world constraints: limited data, noisy labels, class imbalance, and distribution shift. I care more about whether a model generalizes than whether it tops a leaderboard.

## How I approach ML problems

Every project I take on starts from the same principles: understand the data before touching a model, define honest baselines, enforce strict validation, and report limitations as clearly as results. I have found that many published results — including in peer-reviewed venues — fail to survive contact with proper temporal splits or naive baselines. This shapes how I work: I treat evaluation methodology as a first-class concern, not an afterthought.

## What I work on

My experience spans three applied domains:

**Computer Vision (industrial).** At MAGYAR SA, I built an end-to-end CNN-based image classification system for industrial tank categorization, working with a proprietary dataset of ~1,000 images under constraints that most academic benchmarks never encounter — class imbalance, visually similar categories, and inconsistent acquisition conditions. The system achieved 78% F1-score and was delivered as a working prototype.

**Large-scale distributed ML.** For a graduate-level project at UQAC, I designed and implemented a sentiment analysis pipeline processing 1.6 million tweets using PySpark on a Calcul Québec HPC cluster. The work involved MinHash LSH for approximate nearest neighbors, four feature engineering strategies, and scalability analysis demonstrating near-linear computation growth — providing direct experience with the engineering challenges of ML at scale.

**Reproducibility and rigorous evaluation.** I conducted an independent reproducibility study of a Stanford paper claiming 91% accuracy for CNN-based stock prediction. By enforcing strict temporal validation and comparing against explicit naive baselines, I demonstrated that the reported results cannot be reproduced without look-ahead bias. The repository has reached over 65,000 views — evidence that rigorous negative results have real value.

## What I am looking for

I am seeking a **6-month ML Engineer internship starting July 2026**, in Canada, the US, Switzerland, or France. I am looking for teams that value engineering discipline, honest evaluation, and building systems that work in production — not just in notebooks.

Feel free to explore my [portfolio](/portfolio/) or reach out via [email](mailto:matthis.lahargoue@gmail.com) or [LinkedIn](https://linkedin.com/in/matthis-lahargoue).
