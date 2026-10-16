import islLogo from "../assets/logos/isl.webp";
import magyarLogo from "../assets/logos/magyar.webp";
import ensisaLogo from "../assets/logos/ensisa.webp";
import uqacLogo from "../assets/logos/uqac.svg";

export const profile = {
  name: "Matthis Lahargoue",
  email: "matthis.lahargoue@gmail.com",
  github: "https://github.com/matla91",
  linkedin: "https://www.linkedin.com/in/matthis-lahargoue/",
  cv: "/cv/Matthis-Lahargoue-CV.pdf",
  location: "Saint-Louis, France · Basel region",
  tagline: "From physical signals to meaningful models.",
};
export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  visual: "nlos" | "industrial" | "validation" | "basel" | "spark";
  image?: string;
  caption: string;
  metric: string;
  metricLabel: string;
  contribution: string;
  evidence: string;
  context: string;
  approach: string[];
  outcome: string;
  limitation: string;
  source?: string;
  demo?: string;
  sourceLabel?: string;
};
export const projects: Project[] = [
  {
    slug: "nlos-computational-imaging",
    number: "01",
    title: "Seeing beyond the line of sight.",
    shortTitle: "NLOS computational imaging",
    category: "Research · ISL",
    year: "2026 — ongoing",
    visual: "nlos",
    image: "nlos",
    summary:
      "Exploring how transient light and learned models can reveal geometry hidden from direct view.",
    tags: ["PyTorch", "Mitsuba 3", "Dr.Jit", "CUDA"],
    caption:
      "Conceptual illustration from my GitHub profile. Not an ISL experiment or reconstruction result.",
    metric: "Light → geometry",
    metricLabel: "Computational imaging",
    contribution: "I build simulation, data preparation, training and evaluation pipelines as a research intern at ISL.",
    evidence: "Ongoing research. This overview shares the problem and engineering scope; no institutional results are published here.",
    context:
      "An object outside a camera’s direct field of view still leaves a trace in the light that scatters through a scene. Non-line-of-sight imaging studies how to recover hidden structure from these indirect measurements. I work on this topic as a research intern at the French-German Research Institute of Saint-Louis.",
    approach: [
      "Connect transient-light simulation with learning-based reconstruction.",
      "Build data preparation, model training and quantitative evaluation pipelines.",
      "Investigate inverse problems through controlled experiments and reproducible scientific computing.",
    ],
    outcome:
      "Ongoing research at the intersection of simulation, computer vision and inverse problems. This public overview describes the research area and my general engineering focus.",
    limitation:
      "ISL code, datasets, acquisition details, protocols and unpublished results are not included. All artwork on this page is conceptual and uses no institutional experimental data.",
    source: "https://www.isl.eu/",
    sourceLabel: "About ISL",
  },
  {
    slug: "industrial-computer-vision",
    number: "02",
    title: "Learning from imperfect industrial images.",
    shortTitle: "Industrial computer vision",
    category: "Applied ML · MAGYAR SA",
    year: "June 2025",
    visual: "industrial",
    summary:
      "From image collection to an offline CNN prototype for industrial tank classification.",
    tags: ["Computer vision", "CNN", "Data curation", "Evaluation"],
    caption:
      "Curate and label images → train a classifier → evaluate and deliver an offline prototype. Original schematic; no company images or data.",
    metric: "~1,000",
    metricLabel: "Images curated · public project account",
    contribution: "I contributed to the dataset-to-classifier pipeline in a two-person team, from image curation to an offline CNN prototype.",
    evidence: "~1,000 curated images; 78% macro F1 reported in my public project account. Proprietary data; not independently reproducible.",
    context:
      "Industrial tank categories can look almost identical in photographs. In a two-person project for MAGYAR SA, the challenge was to turn inconsistent, limited image data into a useful classification prototype.",
    approach: [
      "Collect, clean, label and preprocess an approximately 1,000-image proprietary dataset.",
      "Train CNN classifiers with transfer learning and image augmentation.",
      "Evaluate precision, recall and F1 with attention to class imbalance and visually similar categories.",
    ],
    outcome:
      "Delivered a functional offline prototype. The existing public project account reports a 78% macro F1-score on a held-out test set.",
    limitation:
      "The dataset and model are proprietary. The score is self-reported in my earlier portfolio; the test split and individual predictions are not available for independent verification. It is a prototype result, not a production performance claim.",
    source:
      "https://github.com/matla91/matla91.github.io/blob/master/_portfolio/01-magyar-cv.md",
    sourceLabel: "Public project account",
  },
  {
    slug: "cnn-reproducibility",
    number: "03",
    title: "A strong model needs a stronger baseline.",
    shortTitle: "CNN reproducibility study",
    category: "Independent study · Evaluation",
    year: "2026",
    visual: "validation",
    summary:
      "Revisiting CNN stock prediction with temporal splits, train-only normalization and explicit naive baselines.",
    tags: ["CNN", "Time series", "Temporal validation", "Reproducibility"],
    caption:
      "Past training data → chronological boundary → future test data. Fit normalization on training data only. Schematic, not a measured result.",
    metric: "62.7%",
    metricLabel: "Reported always-BUY baseline",
    contribution: "I reimplemented and compared CNN variants, chronological splits and train-only normalization against a naive baseline.",
    evidence: "The public repository reports ~62.7% test accuracy for both the always-BUY baseline and the investigated CNNs.",
    context:
      "A Stanford student paper reported up to 91% stock-movement prediction accuracy. I revisited the approach using public JPM data, a 256-day input window and a T+30 forecasting horizon, with a focus on evaluation design.",
    approach: [
      "Reimplement a baseline CNN, a paper-like network and a controlled architectural variant.",
      "Separate training and test data chronologically around 2018; fit normalization on training data.",
      "Report the always-BUY baseline alongside each model, rather than interpreting accuracy in isolation.",
    ],
    outcome:
      "The public repository reports approximately 62.7% test accuracy for the baseline and CNN variants. The investigated models did not improve on the naive baseline in these experiments.",
    limitation:
      "This is a student reproducibility study using a different data source, not proof of a flaw in the original paper. Look-ahead bias is a hypothesis. Overlapping windows and T+30 label boundaries also require scrutiny before calling any split fully leakage-free.",
    source:
      "https://github.com/matla91/cnn-stock-prediction-reproducibility-study",
    sourceLabel: "Explore repository",
  },
  {
    slug: "basel-tram-air",
    number: "04",
    title: "A different view of the daily commute.",
    shortTitle: "Basel Tram Air",
    category: "Hack am Rhein warm-up · Open data",
    year: "2026",
    visual: "basel",
    image: "basel",
    summary:
      "An interactive exploration of historical PM2.5 patterns along Basel’s measured tram corridors.",
    tags: ["Python", "Open data", "Spatial analysis", "Visualization"],
    caption:
      "Project dashboard image reused from my GitHub README. Measurements are historical, not live.",
    metric: "262",
    metricLabel: "Fixed spatial cells",
    contribution: "I connected historical sensor measurements to tram segments and built an interactive hourly map and timelapse.",
    evidence: "Public demo and code. 262 spatial cells; measurements from December 2019 to March 2020, not current conditions.",
    context:
      "What can measurements collected from tram roofs tell us about how air quality varied during the day? Basel Tram Air turns a historical Basel-Stadt open dataset into an interactive view of the measured network.",
    approach: [
      "Group PM2.5 measurements from December 2019 to March 2020 by hour and spatial cell.",
      "Divide official tram lines into short segments and match each to the nearest measured cell.",
      "Build an hourly slider and timelapse so people can explore patterns across the day.",
    ],
    outcome:
      "A public interactive map covering 05:00–20:00. In this dataset, the lowest typical PM2.5 levels were observed around 14:00–15:00.",
    limitation:
      "Historical observations do not describe present-day air quality. Coverage is limited to measured corridors, and matching segments to nearby cells introduces spatial approximation. The map provides no health advice.",
    source: "https://github.com/matla91/basel-tram-air",
    demo: "https://matla91.github.io/basel-tram-air/",
    sourceLabel: "Explore repository",
  },
  {
    slug: "distributed-sentiment-analysis",
    number: "05",
    title: "Taking text classification to cluster scale.",
    shortTitle: "Distributed sentiment analysis",
    category: "Graduate project · UQAC",
    year: "2025",
    visual: "spark",
    summary:
      "Approximate nearest neighbors, MinHash LSH and PySpark on a Calcul Québec HPC cluster.",
    tags: ["PySpark", "MinHash LSH", "NLP", "HPC"],
    caption: "Text representations → distributed partitions → MinHash LSH and approximate nearest neighbors. Conceptual dataflow, not a measured cluster trace.",
    metric: "1.6M",
    metricLabel: "Tweets in Sentiment140",
    contribution: "I compared text representations, nearest-neighbor settings and MinHash LSH experiments using PySpark on Calcul Québec.",
    evidence: "1.6M training tweets in the source dataset. Binary accuracy of 0.854 is self-reported; public run artifacts are unavailable.",
    context:
      "For UQAC’s Machine Learning for Big Data course, I studied distributed sentiment classification using approximate k-nearest neighbors and MinHash LSH with PySpark.",
    approach: [
      "Compare unigram, bigram and lexical-pattern representations.",
      "Study the influence of neighbor counts and hashing on classification.",
      "Run experiments on Calcul Québec infrastructure and examine computation time as dataset size increases.",
    ],
    outcome:
      "The public project account reports 0.854 binary accuracy for a unigram configuration. The project developed my experience in distributed execution, feature engineering and experimental comparison.",
    limitation:
      "The report describes 1.6 million training tweets; this should not be confused with 1.6 million independent test observations. Full split definitions and run artifacts are not linked publicly, so reported metrics and scaling behavior remain self-reported.",
    source:
      "https://github.com/matla91/matla91.github.io/blob/master/_portfolio/03-sentiment-analysis-spark.md",
    sourceLabel: "Public project account",
  },
];
export const organizations = [
  {
    id: "isl",
    name: "ISL",
    logo: islLogo,
    kind: "Research internship",
    period: "July 2026 — present",
    detail: "Computational imaging & NLOS research",
    target: "#experience-isl",
    group: "professional",
  },
  {
    id: "magyar",
    name: "MAGYAR SA",
    logo: magyarLogo,
    kind: "Applied ML project",
    period: "June 2025",
    detail: "Industrial image classification · two-person team",
    target: "#experience-magyar",
    group: "professional",
  },
  {
    id: "ensisa",
    name: "ENSISA",
    logo: ensisaLogo,
    kind: "Engineering degree",
    period: "In progress · diploma expected May 2027",
    detail: "Computer Science & Network Engineering · France",
    target: "#education-ensisa",
    group: "academic",
  },
  {
    id: "uqac",
    name: "UQAC",
    logo: uqacLogo,
    kind: "Master’s double-degree pathway",
    period: "2025–2026 studies · degree pending",
    detail: "Computer Science · Artificial Intelligence · Canada",
    target: "#education-uqac",
    group: "academic",
  },
];
export const skills = [
  {
    number: "01",
    title: "Machine learning",
    text: "From a useful baseline to a carefully evaluated model.",
    tools: ["PyTorch", "Scikit-learn", "CNNs", "Training & evaluation"],
  },
  {
    number: "02",
    title: "Vision & imaging",
    text: "Recovering structure from images and physical signals.",
    tools: [
      "Computer vision",
      "Inverse problems",
      "Transient simulation",
      "Image processing",
    ],
  },
  {
    number: "03",
    title: "Scientific computing",
    text: "Simulation and computation for experimental research.",
    tools: ["Mitsuba 3", "Dr.Jit", "CUDA", "Numerical analysis"],
  },
  {
    number: "04",
    title: "ML engineering",
    text: "Reproducible experiments that work beyond a notebook.",
    tools: ["Python", "Git", "Linux", "HPC / Slurm"],
  },
  {
    number: "05",
    title: "Data & visualization",
    text: "Turning raw observations into interpretable evidence.",
    tools: ["PySpark", "Pandas", "NumPy", "Data visualization"],
  },
];
export const archive = [
  {
    title: "Diabetes risk prediction",
    category: "Interpretable ML",
    tags: "LightGBM · SHAP · Calibration",
    url: "https://github.com/matla91/Diabetes-Prediction-Kaggle-Playground-Series-S5E12",
  },
  {
    title: "Radisson",
    category: "Local information retrieval",
    tags: "Python · Hybrid search · Local LLMs",
    url: "https://github.com/matla91/Radisson",
  },
  {
    title: "Pokémon Trading Card Game",
    category: "Software engineering",
    tags: "C++ · Object-oriented design",
    url: "https://github.com/matla91/Pokemon-Trading-Card-Game",
  },
];
