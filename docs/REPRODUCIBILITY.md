# Reproducibility notes

## Verified reproduction

All statistics reported in the accompanying manuscript were
reproduced bit-identically (up to display rounding) from the
anonymized CSVs in `data/` using the code in this repository with
Python 3.13 and the package versions pinned in `requirements.txt`.

Verified values from `python scripts/run_analysis.py`:

### Post-treatment group (n = 12)

Primary outcome (blinded clinical evaluation):
- Evaluator 1: 11/12 correct (91.7%), binomial p = 0.0032
- Evaluator 2: 11/12 correct (91.7%), binomial p = 0.0032
- Cohen's kappa between evaluators: 0.625 (substantial)

Exploratory image analysis (erythema density):
- Cohen's d = −0.930
- Paired t-test, one-sided: p = 0.0041
- Wilcoxon signed-rank, one-sided: p = 0.0081
- Image-analysis accuracy: 10/12 (83.3%)

### Pre-treatment group (n = 13)

Primary outcome (blinded clinical evaluation):
- Evaluator 1: 11/13 correct (84.6%), binomial p = 0.0112
- Evaluator 2: 12/13 correct (92.3%), binomial p = 0.0017
- Cohen's kappa between evaluators: 0.831 (almost perfect)

Exploratory image analysis (erythema area, per-subject best timepoint):
- Cohen's d = −0.565
- Paired t-test, one-sided: p = 0.0323
- Wilcoxon signed-rank, one-sided: p = 0.0287
- Image-analysis accuracy: 10/13 (76.9%)

Exploratory sensitivity analysis (fixed 6 h timepoint):
- Cohen's d = −0.037
- Paired t-test, one-sided: p = 0.448
- Image-analysis accuracy: 7/13 (53.8%)

The fixed-timepoint sensitivity analysis illustrates that the best-
timepoint analysis is exploratory and hypothesis-generating. Please
see `docs/METHODOLOGY.md` Section 7 and the manuscript Discussion for
context on the two temporal patterns of post-laser erythema and the
planned prospective validation.

## Independent verification procedure

To independently verify the above:

1. Clone this repository:

        git clone https://github.com/kentaro-oku/UFW-erythema-analysis.git
        cd UFW-erythema-analysis

2. Install pinned dependencies in an isolated environment:

        python -m venv .venv
        source .venv/bin/activate   # Linux/macOS
        .venv\Scripts\activate      # Windows
        pip install -r requirements.txt

3. Run the analysis:

        python scripts/run_analysis.py

The printed values should match those above exactly (up to
floating-point display precision).

## Environment details

| Component | Tested version |
|-----------|:--------------:|
| Python    | 3.13 |
| NumPy     | 2.2.x |
| Pillow    | 11.1.x |
| SciPy     | 1.15.x |
| pandas    | 2.2.x |
| scikit-learn | 1.5.x |

## Determinism

- No random-number generators are invoked in any code path.
- No network access is required.
- Output is deterministic given the CSV inputs and pinned package versions.

## Reporting a reproduction failure

If `python scripts/run_analysis.py` produces values that differ from
the above, please open an issue on GitHub with:

- Your operating system and architecture
- The exact Python and package versions in use (`pip freeze`)
- The complete stdout of the failing run
