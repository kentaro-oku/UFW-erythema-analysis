# Anonymized data files

This directory contains derived per-subject metrics sufficient to reproduce
all statistical results reported in the accompanying manuscript. **No raw
images are included** (identifiable facial information; see top-level
README).

## Anonymization

- Each subject is assigned an opaque identifier `P01`, `P02`, etc.
- Identifiers are not consistent across `post_tx_metrics.csv` and
  `pre_tx_metrics.csv`; no subject linkage between files is available
  in this public release.
- The mapping between public IDs and original subject identifiers is
  retained in a separate access-controlled file held by the
  corresponding author.

## File descriptions

### `post_tx_metrics.csv` (n = 12)

Per-subject erythema-density values for the post-treatment group.

| Column | Description |
|--------|-------------|
| `subject_id` | Anonymized subject identifier (P01..P12) |
| `ws_side` | Ground-truth side of UFW application: `Rt` or `Lt` |
| `t2_rt_density` | Erythema density on right cheek at T2 (post-laser / pre-UFW) |
| `t2_lt_density` | Erythema density on left cheek at T2 |
| `t3_rt_density` | Erythema density on right cheek at T3 (post-UFW) |
| `t3_lt_density` | Erythema density on left cheek at T3 |
| `eval1` | Side identified by blinded Evaluator 1 |
| `eval2` | Side identified by blinded Evaluator 2 |

Derived values (WS Δdensity, Ctrl Δdensity, etc.) are computed on the fly
by `scripts/run_analysis.py` and are not duplicated in the CSV.

### `pre_tx_metrics.csv` (n = 13)

Per-subject erythema-area values for the pre-treatment group.

| Column | Description |
|--------|-------------|
| `subject_id` | Anonymized subject identifier (P01..P13) |
| `ws_side` | Ground-truth side of UFW application: `Rt` or `Lt` |
| `rt_area_0h` | Erythema area on right cheek at 0 h (immediately post-laser) |
| `rt_area_1h` | Erythema area on right cheek at 1 h |
| `rt_area_6h` | Erythema area on right cheek at 6 h |
| `lt_area_0h` | Erythema area on left cheek at 0 h |
| `lt_area_1h` | Erythema area on left cheek at 1 h |
| `lt_area_6h` | Erythema area on left cheek at 6 h |
| `best_tp` | Per-subject best timepoint (`1h` or `6h`) by exploratory selection |
| `eval1` | Side identified by blinded Evaluator 1 |
| `eval2` | Side identified by blinded Evaluator 2 |

All values are directly computed from the hemoglobin-enhanced images using
the pipeline in `src/`. No rounding or post-processing beyond the pipeline
has been applied.

## License

These anonymized data are released under the
[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
license.
