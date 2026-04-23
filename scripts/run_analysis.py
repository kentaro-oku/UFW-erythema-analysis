"""
run_analysis.py
===============

Reproduce all statistical results reported in the manuscript from the
anonymized data in ``data/post_tx_metrics.csv`` and ``data/pre_tx_metrics.csv``.

Usage
-----
    python scripts/run_analysis.py

The script is deterministic and uses no random-number generators; outputs
are bit-reproducible given the pinned package versions in
``requirements.txt``.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import numpy as np
import pandas as pd

# Make the project importable regardless of working directory.
HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT))

from src.statistics import (  # noqa: E402
    binomial_p,
    cohen_kappa,
    paired_comparison,
)


DATA_DIR = ROOT / "data"


def fmt(x: float, digits: int = 3) -> str:
    """Formatted float with a fixed number of digits after the decimal point."""
    return f"{x:.{digits}f}"


def print_paired(label: str, res) -> None:
    print(f"  {label}:")
    print(f"    n             : {res.n}")
    print(f"    WS   (mean±SD): {fmt(res.mean_ws)} ± {fmt(res.std_ws)}")
    print(f"    Ctrl (mean±SD): {fmt(res.mean_ctrl)} ± {fmt(res.std_ctrl)}")
    print(f"    Mean diff     : {fmt(res.mean_diff)} ± {fmt(res.std_diff)}")
    print(f"    95% CI (diff) : [{fmt(res.ci95_low)}, {fmt(res.ci95_high)}]")
    print(f"    Cohen's d     : {fmt(res.cohen_d)}")
    print(f"    Paired t (1s) : p = {res.t_pvalue_one_sided:.4f}")
    print(f"    Wilcoxon (1s) : p = {res.wilcoxon_pvalue_one_sided:.4f}")
    print(f"    Accuracy      : {res.correct}/{res.n} "
          f"({res.accuracy*100:.1f}%)")


def print_kappa(res) -> None:
    print(f"    n                  : {res.n}")
    print(f"    Observed agreement : {res.observed_agreement*100:.1f}%")
    print(f"    Expected by chance : {res.expected_agreement*100:.1f}%")
    print(f"    Cohen's kappa      : {fmt(res.kappa)} "
          f"(95% CI: {fmt(res.ci95_low)}..{fmt(res.ci95_high)})")
    print(f"    Landis-Koch label  : {res.landis_koch}")


# ---------------------------------------------------------------------------
# Post-Tx group
# ---------------------------------------------------------------------------

def run_post_tx() -> None:
    print("=" * 72)
    print("POST-TREATMENT GROUP")
    print("Primary exploratory metric: erythema density (R-G > 50)")
    print("T2 = post-laser / pre-UFW; T3 = post-UFW; delta = T3 - T2")
    print("=" * 72)

    df = pd.read_csv(DATA_DIR / "post_tx_metrics.csv")
    assert len(df) == 12, "Post-Tx expected n = 12"

    # Per-subject WS-side and control-side density change.
    ws_delta = np.where(
        df["ws_side"] == "Rt",
        df["t3_rt_density"] - df["t2_rt_density"],
        df["t3_lt_density"] - df["t2_lt_density"],
    )
    ctrl_delta = np.where(
        df["ws_side"] == "Rt",
        df["t3_lt_density"] - df["t2_lt_density"],
        df["t3_rt_density"] - df["t2_rt_density"],
    )

    # Primary outcome (blinded evaluators) ---------------------------------
    print("\n[ Primary outcome: Blinded clinical evaluation ]")
    acc_e1 = int((df["eval1"] == df["ws_side"]).sum())
    acc_e2 = int((df["eval2"] == df["ws_side"]).sum())
    print(f"  Evaluator 1 accuracy: {acc_e1}/{len(df)} "
          f"({acc_e1/len(df)*100:.1f}%), binomial p = "
          f"{binomial_p(acc_e1, len(df)):.4f}")
    print(f"  Evaluator 2 accuracy: {acc_e2}/{len(df)} "
          f"({acc_e2/len(df)*100:.1f}%), binomial p = "
          f"{binomial_p(acc_e2, len(df)):.4f}")
    print("\n  [ Inter-rater reliability (Evaluator 1 vs Evaluator 2) ]")
    print_kappa(cohen_kappa(df["eval1"], df["eval2"]))

    # Exploratory secondary outcome (image analysis) -----------------------
    print("\n[ Exploratory: Image analysis - erythema density ]")
    print_paired("Paired WS vs Ctrl density change",
                 paired_comparison(ws_delta, ctrl_delta))


# ---------------------------------------------------------------------------
# Pre-Tx group
# ---------------------------------------------------------------------------

def run_pre_tx() -> None:
    print("\n")
    print("=" * 72)
    print("PRE-TREATMENT GROUP")
    print("Primary exploratory metric: erythema area (R-G > 50)")
    print("Best-timepoint selection between 1 h and 6 h (exploratory)")
    print("=" * 72)

    df = pd.read_csv(DATA_DIR / "pre_tx_metrics.csv")
    assert len(df) == 13, "Pre-Tx expected n = 13"

    # Per-cheek area change from 0 h.
    for side in ("rt", "lt"):
        df[f"{side}_d1h"] = df[f"{side}_area_1h"] - df[f"{side}_area_0h"]
        df[f"{side}_d6h"] = df[f"{side}_area_6h"] - df[f"{side}_area_0h"]

    # Per-subject best-timepoint WS-side and control-side delta.
    ws_delta = []
    ctrl_delta = []
    for _, row in df.iterrows():
        is_rt = row["ws_side"] == "Rt"
        ws_prefix = "rt" if is_rt else "lt"
        ctrl_prefix = "lt" if is_rt else "rt"
        if row["best_tp"] == "1h":
            ws_delta.append(row[f"{ws_prefix}_d1h"])
            ctrl_delta.append(row[f"{ctrl_prefix}_d1h"])
        else:
            ws_delta.append(row[f"{ws_prefix}_d6h"])
            ctrl_delta.append(row[f"{ctrl_prefix}_d6h"])

    ws_delta = np.asarray(ws_delta)
    ctrl_delta = np.asarray(ctrl_delta)

    # Primary outcome (blinded evaluators) ---------------------------------
    print("\n[ Primary outcome: Blinded clinical evaluation ]")
    acc_e1 = int((df["eval1"] == df["ws_side"]).sum())
    acc_e2 = int((df["eval2"] == df["ws_side"]).sum())
    print(f"  Evaluator 1 accuracy: {acc_e1}/{len(df)} "
          f"({acc_e1/len(df)*100:.1f}%), binomial p = "
          f"{binomial_p(acc_e1, len(df)):.4f}")
    print(f"  Evaluator 2 accuracy: {acc_e2}/{len(df)} "
          f"({acc_e2/len(df)*100:.1f}%), binomial p = "
          f"{binomial_p(acc_e2, len(df)):.4f}")
    print("\n  [ Inter-rater reliability (Evaluator 1 vs Evaluator 2) ]")
    print_kappa(cohen_kappa(df["eval1"], df["eval2"]))

    # Exploratory secondary outcome (image analysis) -----------------------
    print("\n[ Exploratory: Image analysis - erythema area "
          "(per-subject best timepoint) ]")
    print_paired("Paired WS vs Ctrl area change",
                 paired_comparison(ws_delta, ctrl_delta))

    # Sensitivity analysis at fixed 6 h timepoint (exploratory).
    ws_6h = np.where(df["ws_side"] == "Rt", df["rt_d6h"], df["lt_d6h"])
    ctrl_6h = np.where(df["ws_side"] == "Rt", df["lt_d6h"], df["rt_d6h"])
    print("\n[ Exploratory sensitivity analysis: fixed 6 h timepoint ]")
    print_paired("Paired WS vs Ctrl area change (6 h only)",
                 paired_comparison(ws_6h, ctrl_6h))


def main() -> None:
    if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    run_post_tx()
    run_pre_tx()
    print("\n[ Analysis complete. ]")


if __name__ == "__main__":
    main()
