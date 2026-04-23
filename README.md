# UFW-Erythema-Analysis

Semi-quantitative hemoglobin-enhanced image analysis pipeline for evaluating post-laser erythema reduction by nano-sized ultrafine water clusters (UFW).

This repository accompanies the manuscript:

> **Efficacy of Nano-Sized Ultrafine Water Clusters in Reducing Erythema Following Fractionated Picosecond Alexandrite Laser Treatment: A Split-Face, Randomized, Evaluator-Blinded Pilot Study.**
> *Lasers in Medical Science* (under review).

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/release/python-3130/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

---

## Overview

This repository provides a fully reproducible implementation of the semi-quantitative image-analysis pipeline used to quantify post-laser facial erythema from hemoglobin-enhanced lateral-view photographs. The analysis computes two complementary chromatic erythema metrics from RGB images and performs paired statistical comparisons between UFW-treated and contralateral control hemifaces.

### Key components

| Component | Description |
|-----------|-------------|
| **Skin mask** | Color-space skin-pixel segmentation: R ∈ [80, 250], G ∈ [40, 220], R − G > −10 |
| **Hemoglobin index** | Per-pixel R − G difference (proxy for oxyhemoglobin absorption) |
| **Erythema density** | Mean R − G of skin pixels exceeding threshold (R − G > 50) |
| **Erythema area** | Fraction of skin pixels exceeding threshold (R − G > 50) |
| **Statistics** | One-sided paired *t*-test, Wilcoxon signed-rank, Cohen's *d*, Cohen's κ, binomial test |

### Metrics by group (pre-specified)

| Group | Primary metric | Sensitivity metric |
|-------|:-------------:|:------------------:|
| Post-treatment (n = 12) | Erythema density | Erythema area |
| Pre-treatment (n = 13) | Erythema area | Erythema density |

---

## Installation

### Requirements

- Python **3.13** (tested) or Python ≥ 3.10
- OS: Windows / macOS / Linux
- Disk: < 50 MB

### Setup

```bash
git clone https://github.com/kentaro-oku/UFW-erythema-analysis.git
cd UFW-erythema-analysis
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
.venv\Scripts\activate           # Windows
pip install -r requirements.txt
```

---

## Quick start

### Reproduce the published statistics from anonymized data

```bash
python scripts/run_analysis.py
```

Expected output:

```
=== POST-TREATMENT GROUP (n = 12) ===
Primary metric: erythema density (R−G > 50)
  WS ΔDensity  : −3.46 ± 1.55
  Ctrl ΔDensity: −2.38 ± 1.70
  Mean diff    : −1.07 ± 1.15
  Cohen's d    : −0.930
  Paired t-test (1-sided): p = 0.0041
  Wilcoxon (1-sided)     : p = 0.0081
  Image-analysis accuracy: 10/12 (83.3%)

Inter-rater agreement (Evaluator 1 vs Evaluator 2):
  Observed agreement: 10/12 (83.3%)
  Cohen's kappa     : 0.625  (substantial, per Landis & Koch 1977)

=== PRE-TREATMENT GROUP (n = 13) ===
Primary metric: erythema area (R−G > 50, per-subject best timepoint)
  WS ΔArea  : −0.008 ± 0.028
  Ctrl ΔArea: +0.004 ± 0.029
  Mean diff : −0.012 ± 0.021
  Cohen's d : −0.570
  Paired t-test (1-sided): p = 0.0311
  Wilcoxon (1-sided)     : p = 0.0287
  Image-analysis accuracy: 10/13 (76.9%)

Inter-rater agreement (Evaluator 1 vs Evaluator 2):
  Observed agreement: 12/13 (92.3%)
  Cohen's kappa     : 0.831  (almost perfect, per Landis & Koch 1977)
```

### Analyze your own images

```python
from src.image_analysis import analyze_image
from src.erythema_metrics import erythema_density, erythema_area

features = analyze_image("path/to/lateral_view.jpg")
print(f"Erythema density: {features['density_50']:.3f}")
print(f"Erythema area:    {features['area_50']:.4f}")
```

---

## Repository layout

```
UFW-erythema-analysis/
├── README.md                    This file
├── LICENSE                      MIT License
├── CITATION.cff                 Citation metadata (GitHub standard)
├── requirements.txt             Pinned Python package versions
├── .gitignore
├── src/
│   ├── __init__.py
│   ├── hemoglobin_index.py      R-G index + skin-pixel mask
│   ├── erythema_metrics.py      Density & area computation
│   ├── image_analysis.py        Image loading + full feature extraction
│   └── statistics.py            Paired t / Wilcoxon / Cohen's d / κ
├── data/
│   ├── README.md                Data description
│   ├── post_tx_metrics.csv      Anonymized Post-Tx per-subject metrics
│   └── pre_tx_metrics.csv       Anonymized Pre-Tx per-subject metrics
├── scripts/
│   ├── run_analysis.py          End-to-end analysis (reproduces paper stats)
│   └── example_single_image.py  Single-image analysis example
└── docs/
    ├── METHODOLOGY.md           Analysis design and rationale
    └── REPRODUCIBILITY.md       Notes on reproduction and verification
```

---

## Data availability

This repository includes **anonymized derived metrics** (per-subject R − G density and area values at the relevant timepoints, blinded-evaluator identifications, and ground-truth side labels) sufficient to fully reproduce all statistical results reported in the manuscript.

**Raw hemoglobin-enhanced images are NOT included** because they contain identifiable facial information protected under the conditions of informed consent. Raw images may be made available to qualified investigators on reasonable request to the corresponding author, subject to a data-use agreement and ethics-committee approval.

Subjects are identified as `P01`, `P02`, ... in all public files. The mapping between public IDs and original identifiers is retained in a separate access-controlled file held by the corresponding author and is not part of this repository.

---

## Scientific methodology

See [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) for a detailed description of the analytical pipeline, threshold selection rationale, pre-specified metric assignment, and best-timepoint sensitivity analysis.

Briefly:

1. Lateral-view (45°) hemoglobin-enhanced images are captured with a Re-Beau2 skin analyzer (JMEC Co., Ltd., Tokyo, Japan) under standardized room conditions (24 ± 1 °C).
2. Each image is cropped to the central 70% (width) × 80% (height).
3. Skin pixels are segmented using a color-space mask.
4. The R − G channel difference serves as a hemoglobin index (proxy for oxyhemoglobin absorption).
5. Two complementary metrics are derived: erythema density (intensity) and erythema area (extent).
6. Paired statistics are computed between the UFW-treated and contralateral sides.

---

## Citation

If you use this code or any of its components in your research, please cite both the software and the associated manuscript.

**Software:**
```
Oku K. UFW-erythema-analysis: Semi-quantitative image analysis pipeline for post-laser erythema quantification. Zenodo. 2026. DOI: 10.5281/zenodo.XXXXXXX.
```

**Manuscript:**
```
Oku K. Efficacy of nano-sized ultrafine water clusters in reducing erythema following fractionated picosecond alexandrite laser treatment: A split-face, randomized, evaluator-blinded pilot study. Lasers Med Sci. 2026 (under review).
```

A `CITATION.cff` file is provided for automatic citation export in GitHub.

---

## Reproducibility

All reported statistics in the manuscript can be independently reproduced by running:

```bash
python scripts/run_analysis.py
```

against the anonymized CSV files included in `data/`. The Python package versions pinned in `requirements.txt` are the versions used for the published analysis.

We have verified bit-identical reproduction of all reported effect sizes, p-values, and accuracy rates with:

- Python 3.13
- NumPy 2.2
- Pillow 11.1
- SciPy 1.15
- pandas 2.2
- scikit-learn 1.5

---

## License

This code is released under the [MIT License](LICENSE). Data files in `data/` are released under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

---

## Ethics and consent

The study that generated the original image data was approved by the **Shiba Palace Clinic Ethics Review Board** (an independent third-party ethics committee; approval number on file with the corresponding author), and was conducted in accordance with the principles of the Declaration of Helsinki. Written informed consent was obtained from all participants for research use and for publication of anonymized results.

Individual raw images are withheld from this public repository to preserve participant privacy.

---

## Contact

Corresponding author: **Kentaro Oku, MD**
Institution: **Hills Grace Clinic, Yokohama, Japan**
Email: **kentaro.oku@hillsgrace.or.jp**

For questions about the code, please open an issue on this repository.
For questions about the clinical study, please contact the corresponding author directly.

---

## Acknowledgements

We thank the participants of the clinical study and the independent board-certified dermatologists who served as blinded evaluators. We thank Aisin Corporation for the Windscell device (purchased at standard retail price; no financial or non-financial support was received from Aisin Corporation for this study).
