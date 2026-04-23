# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-XX-XX

### Added

- Initial public release accompanying submission of the manuscript
  "Efficacy of Nano-Sized Ultrafine Water Clusters in Reducing Erythema
  Following Fractionated Picosecond Alexandrite Laser Treatment"
  (Lasers in Medical Science, under review).
- Image-analysis pipeline (`src/`)
    - `hemoglobin_index.py`: R - G hemoglobin index and skin-pixel
      color-space mask (R ∈ [80, 250], G ∈ [40, 220], R - G > -10).
    - `erythema_metrics.py`: erythema density and area at the
      pre-specified threshold R - G > 50.
    - `image_analysis.py`: single-image feature extraction pipeline.
    - `statistics.py`: paired t-test (one-sided), Wilcoxon signed-rank,
      Cohen's d, binomial test, Cohen's kappa with Landis-Koch labels.
- Anonymized per-subject derived metrics (`data/`)
    - `post_tx_metrics.csv` (n = 12)
    - `pre_tx_metrics.csv` (n = 13)
- End-to-end analysis script (`scripts/run_analysis.py`) that reproduces
  all statistics reported in the manuscript.
- Unit tests (`tests/`) covering all public functions in `src/`;
  20 tests, all passing.
- Documentation (`docs/METHODOLOGY.md`, `docs/REPRODUCIBILITY.md`).
- MIT License for code; CC BY 4.0 for anonymized data.
- `CITATION.cff` for standardized citation export.
