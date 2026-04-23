"""
statistics.py
=============

Paired statistical comparisons for the split-face design and
inter-rater reliability analysis.

Functions
---------
- paired_comparison : one-sided paired t-test, Wilcoxon, Cohen's d, 95% CI
- cohen_kappa       : two-rater Cohen's kappa with asymptotic 95% CI
- binomial_p        : one-sided binomial test against chance (0.5)
- landis_koch_label : categorical interpretation of a kappa value
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from typing import Dict, Iterable, Sequence, Tuple

import numpy as np
from scipy import stats


# -----------------------------------------------------------------------------
# Paired comparison
# -----------------------------------------------------------------------------

@dataclass
class PairedResult:
    """Container for paired-comparison results."""
    n: int
    mean_ws: float
    std_ws: float
    mean_ctrl: float
    std_ctrl: float
    mean_diff: float
    std_diff: float
    cohen_d: float
    t_pvalue_one_sided: float
    wilcoxon_pvalue_one_sided: float
    ci95_low: float
    ci95_high: float
    correct: int          # number of subjects where (ws - ctrl) < 0
    accuracy: float       # correct / n


def paired_comparison(ws: Sequence[float],
                      ctrl: Sequence[float]) -> PairedResult:
    """Paired comparison of UFW-treated vs contralateral control.

    A one-sided alternative is used, testing the directional
    hypothesis that the UFW-treated side shows a *more negative*
    change than the control side.

    Parameters
    ----------
    ws : Sequence[float]
        Per-subject change on the UFW-treated side.
    ctrl : Sequence[float]
        Per-subject change on the control side.

    Returns
    -------
    PairedResult
    """
    ws = np.asarray(ws, dtype=float)
    ctrl = np.asarray(ctrl, dtype=float)
    if len(ws) != len(ctrl):
        raise ValueError("ws and ctrl must have equal length.")
    diff = ws - ctrl
    n = len(diff)

    mean_diff = float(np.mean(diff))
    std_diff = float(np.std(diff, ddof=1))
    se = std_diff / np.sqrt(n)

    # Cohen's d for paired samples (using SD of the differences).
    cohen_d = mean_diff / std_diff if std_diff > 0 else float("nan")

    # One-sided paired t (alternative: mean_diff < 0).
    t_two = stats.ttest_rel(ws, ctrl).pvalue
    t_one = t_two / 2 if mean_diff < 0 else 1 - (t_two / 2)

    # One-sided Wilcoxon signed-rank (alternative: median diff < 0).
    w_two = stats.wilcoxon(diff).pvalue
    w_one = w_two / 2 if mean_diff < 0 else 1 - (w_two / 2)

    # 95% CI of the paired difference (normal approximation).
    ci_low = mean_diff - 1.96 * se
    ci_high = mean_diff + 1.96 * se

    correct = int(np.sum(diff < 0))
    accuracy = correct / n

    return PairedResult(
        n=n,
        mean_ws=float(np.mean(ws)),
        std_ws=float(np.std(ws, ddof=1)),
        mean_ctrl=float(np.mean(ctrl)),
        std_ctrl=float(np.std(ctrl, ddof=1)),
        mean_diff=mean_diff,
        std_diff=std_diff,
        cohen_d=cohen_d,
        t_pvalue_one_sided=float(t_one),
        wilcoxon_pvalue_one_sided=float(w_one),
        ci95_low=float(ci_low),
        ci95_high=float(ci_high),
        correct=correct,
        accuracy=accuracy,
    )


# -----------------------------------------------------------------------------
# Binomial test
# -----------------------------------------------------------------------------

def binomial_p(correct: int, n: int, p: float = 0.5) -> float:
    """One-sided binomial test P(X >= correct | n, p).

    Parameters
    ----------
    correct : int
        Number of correct identifications.
    n : int
        Total number of subjects.
    p : float, optional
        Null probability of a single correct identification (default 0.5).

    Returns
    -------
    float
        One-sided p-value.
    """
    return float(stats.binom.sf(correct - 1, n, p))


# -----------------------------------------------------------------------------
# Cohen's kappa
# -----------------------------------------------------------------------------

@dataclass
class KappaResult:
    """Container for Cohen's kappa results."""
    n: int
    observed_agreement: float
    expected_agreement: float
    kappa: float
    se: float
    ci95_low: float
    ci95_high: float
    landis_koch: str


def cohen_kappa(rater1: Sequence, rater2: Sequence) -> KappaResult:
    """Two-rater Cohen's kappa with asymptotic 95% CI.

    Parameters
    ----------
    rater1, rater2 : Sequence
        Rater judgments. Must be equal length.

    Returns
    -------
    KappaResult
    """
    rater1 = list(rater1)
    rater2 = list(rater2)
    if len(rater1) != len(rater2):
        raise ValueError("rater1 and rater2 must have equal length.")

    n = len(rater1)
    agree = sum(1 for a, b in zip(rater1, rater2) if a == b)
    p_o = agree / n

    c1 = Counter(rater1)
    c2 = Counter(rater2)
    categories = set(c1.keys()) | set(c2.keys())
    p_e = sum((c1[c] / n) * (c2[c] / n) for c in categories)

    if p_e >= 1.0:
        kappa = 1.0
        se = 0.0
    else:
        kappa = (p_o - p_e) / (1 - p_e)
        # Fleiss standard-error approximation.
        se = np.sqrt(p_o * (1 - p_o) / (n * (1 - p_e) ** 2))

    ci_low = kappa - 1.96 * se
    ci_high = kappa + 1.96 * se

    return KappaResult(
        n=n,
        observed_agreement=p_o,
        expected_agreement=p_e,
        kappa=float(kappa),
        se=float(se),
        ci95_low=float(ci_low),
        ci95_high=float(ci_high),
        landis_koch=landis_koch_label(kappa),
    )


def landis_koch_label(kappa: float) -> str:
    """Return the Landis-Koch (1977) agreement label for a kappa value.

    Reference
    ---------
    Landis JR, Koch GG. The measurement of observer agreement for
    categorical data. Biometrics. 1977;33(1):159-174.
    """
    if kappa < 0.00:
        return "poor"
    if kappa < 0.21:
        return "slight"
    if kappa < 0.41:
        return "fair"
    if kappa < 0.61:
        return "moderate"
    if kappa < 0.81:
        return "substantial"
    return "almost perfect"
