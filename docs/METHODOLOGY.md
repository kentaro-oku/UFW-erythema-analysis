# Methodology

Detailed description of the semi-quantitative image-analysis pipeline.

## 1. Imaging conditions

All hemoglobin-enhanced images used in this study were acquired with the
**Re-Beau2** skin analyzer (JMEC Co., Ltd., Tokyo, Japan) under
standardized laboratory conditions:

- Room temperature: **24 ± 1 °C** throughout all sessions.
- Acclimatization: subjects rested in the imaging room for at least
  **10 minutes** prior to the first image acquisition to allow
  stabilization of facial skin temperature.
- Illumination: Re-Beau2 built-in standardized illumination.
- Views captured per session: frontal, right 45°, and left 45°.

Hemoglobin-enhanced imaging exploits the higher optical absorption of
oxyhemoglobin in the red wavelength band. The instrument's
"hemoglobin" channel corresponds operationally to the RGB image in
which the R-minus-G chromatic difference is enhanced for clinically
relevant hemoglobin regions.

## 2. Image preprocessing

Each lateral-view image is:

1. Loaded as an 8-bit RGB array.
2. Cropped to the **central 70% (width) × 80% (height)** to exclude
   peripheral imaging artifacts (frame edges, hair, background).
3. Retained at the original pixel resolution with no resampling or
   histogram equalization.

## 3. Skin-pixel segmentation

Skin pixels are identified by a color-space mask whose bounds were
empirically calibrated on a development subset prior to the main
analysis and held fixed thereafter:

```
R ∈ [80, 250]
G ∈ [40, 220]
R - G > −10
```

Pixels failing any one of these conditions are excluded. This filters
out hair, dark background, overexposed highlights, and (through the
lower R-G bound) areas with a faintly green cast that are not skin.

An image is deemed **unanalyzable** and skipped if fewer than **1,000
skin pixels** are identified after cropping.

## 4. Hemoglobin index

The per-pixel hemoglobin index is the scalar

    H(x, y) = R(x, y) − G(x, y)

where R and G are the red and green channel values of the cropped RGB
image. This chromatic difference reflects the relative contribution
of oxyhemoglobin absorption in the red wavelength band, and is the
physical principle underlying the hemoglobin-enhanced imaging mode
used here.

## 5. Erythema metrics

Two complementary scalar metrics are computed per image from the
skin-masked R-G map, using a **pre-specified fixed threshold of
R − G > 50**:

### 5.1 Erythema density

    density_50 = mean{ R - G | pixel is skin AND (R - G) > 50 }

Interpretation: average chromatic intensity of the erythematous
regions. Intended to quantify the **intensity** of redness within
already-established erythematous foci.

Undefined (reported as 0.0) when fewer than 100 skin pixels exceed the
threshold.

### 5.2 Erythema area

    area_50 = | { skin pixels with R - G > 50 } | / | { skin pixels } |

A number in [0, 1]. Interpretation: proportion of analyzed skin
occupied by thresholded erythematous pixels, i.e., the **spatial
extent** of erythema.

### 5.3 Threshold rationale

The threshold of 50 was chosen during method development on a
calibration subset that was separate from the main study analysis. It
was selected to discriminate clinically meaningful erythema from
background skin tone in the Re-Beau2 hemoglobin-enhanced image space.
Once selected, it was held fixed throughout all analyses.

No data-dependent threshold tuning was performed on the main study
images. The threshold is pre-specified in `src/erythema_metrics.py`
(constant `ERYTHEMA_THRESHOLD`) and can be independently verified.

## 6. Pre-specified metric assignment

Two treatment protocols were evaluated in the study:

- **Post-treatment** protocol: UFW applied after laser irradiation to
  pre-existing bilateral erythema.
- **Pre-treatment** protocol: UFW applied before laser irradiation,
  hypothesized to attenuate the formation of new erythematous foci.

The **primary exploratory metric** for each group was pre-specified
based on the distinct mechanistic hypothesis for each protocol:

| Group | Primary metric | Hypothesis |
|-------|----------------|------------|
| Post-treatment | **Erythema density** | UFW reduces the *intensity* of existing vascular engorgement. |
| Pre-treatment | **Erythema area** | UFW suppresses the *formation* of new erythematous foci. |

Analyses applying the alternative metric to each group are
pre-specified **sensitivity analyses** and are reported for
transparency in `scripts/run_analysis.py`.

## 7. Timepoint handling

### Post-treatment group (n = 12)

Density is compared between T2 (post-laser, pre-UFW) and T3 (post-UFW).
The per-subject change on each cheek is

    Δdensity = density(T3) − density(T2)

The UFW-treated side is defined by random allocation; the contralateral
side serves as the split-face control.

### Pre-treatment group (n = 13)

Images are acquired at 0 h (immediately post-laser), 1 h, and 6 h.
Per-cheek area change from 0 h is computed as

    Δarea(t) = area(t) − area(0h)

Two clinical temporal patterns of post-laser erythema have been
observed in this patient population:

- **Pattern A (monotonic decline)**: erythema peaks at 0 h and
  monotonically declines.
- **Pattern B (delayed flare-up)**: erythema is moderate at 0 h,
  increases to a delayed peak at 2-4 h, then resolves.

Accordingly, a **per-subject best-timepoint selection** (1 h or 6 h)
is applied as an **exploratory** approach that accommodates both
temporal patterns. This selection is part of the exploratory
secondary analysis and is explicitly labeled as such in both the
manuscript and the code. A **fixed 6 h** sensitivity analysis is also
reported for completeness.

Confirmatory replication with a pre-registered primary timepoint is
identified as a priority for future work.

## 8. Statistical analysis

### Primary outcome (blinded clinical evaluation)

- Binomial test, one-sided against chance (p = 0.5).
- Inter-rater reliability between two independent blinded
  board-certified dermatologists: Cohen's κ with asymptotic 95% CI.
- Interpretation label follows Landis & Koch (1977):
  slight / fair / moderate / substantial / almost perfect.

### Exploratory secondary outcome (image analysis)

For each group and its pre-specified primary metric:

1. Per-subject paired difference
   `Δ(UFW) − Δ(Control)` computed.
2. One-sided paired t-test (alternative: UFW-treated side shows a more
   negative change than control).
3. One-sided Wilcoxon signed-rank test (non-parametric confirmation).
4. Effect size reported as **Cohen's d** computed on the paired
   differences (mean of differences divided by SD of differences).
5. 95% CI of the paired difference via normal approximation.
6. Image-analysis accuracy: proportion of subjects for whom
   `Δ(UFW) − Δ(Control) < 0`.

### Software

| Package | Pinned version |
|---------|:--------------:|
| Python | 3.13 |
| NumPy | 2.2 |
| Pillow | 11.1 |
| SciPy | 1.15 |
| pandas | 2.2 |
| scikit-learn | 1.5 (used only for kappa cross-verification) |

## 9. Reproducibility note

The analysis is deterministic. No random-number generators are used.
Running `python scripts/run_analysis.py` against the anonymized CSVs
in `data/` yields bit-identical statistics to those reported in the
manuscript, subject to the pinned package versions above.
