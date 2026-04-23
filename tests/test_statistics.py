"""Unit tests for src.statistics."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src.statistics import (  # noqa: E402
    binomial_p,
    cohen_kappa,
    landis_koch_label,
    paired_comparison,
)


# ---------------------------------------------------------------------------
# Paired comparison
# ---------------------------------------------------------------------------

def test_paired_comparison_reproduces_post_tx_stats() -> None:
    """Reproduce the Post-Tx group primary statistics from the manuscript.

    WS side shows greater density reduction (more negative) than Control.
    Expected: Cohen's d = -0.930, one-sided t-test p = 0.0041.
    """
    # Per-subject (WS - Ctrl) density changes, from the anonymized CSV.
    ws_delta = np.array([
        -4.545, -2.908, -7.849, -6.082, -4.165, -1.486,
        -4.338, -3.218, -3.500, -2.128, -2.302, -2.607,
    ])
    ctrl_delta = np.array([
        -3.780, -2.415, -5.489, -3.957, -2.190, -2.240,
        -2.468, -2.364, -3.035,  0.385, -2.983, -2.074,
    ])

    # Deliberately use the values directly (not from CSV) to avoid
    # circular dependency in this unit test.
    res = paired_comparison(ws_delta, ctrl_delta)
    assert res.n == 12
    assert abs(res.cohen_d - (-0.930)) < 0.005
    assert abs(res.t_pvalue_one_sided - 0.0041) < 0.001


def test_paired_comparison_length_mismatch_raises() -> None:
    """Mismatched input lengths raise ValueError."""
    try:
        paired_comparison([1, 2, 3], [1, 2])
    except ValueError:
        return
    raise AssertionError("Expected ValueError for length mismatch.")


# ---------------------------------------------------------------------------
# Binomial test
# ---------------------------------------------------------------------------

def test_binomial_p_exact_values() -> None:
    """Binomial one-sided p for small n matches hand computation."""
    # n=10, k=10 -> P(X >= 10) = 0.5^10 = 9.765625e-4
    p = binomial_p(10, 10)
    assert abs(p - 0.5**10) < 1e-12

    # n=12, k=11 -> P(X >= 11) = C(12,11)*0.5^12 + C(12,12)*0.5^12
    # = 12/4096 + 1/4096 = 13/4096 = 0.00317...
    p = binomial_p(11, 12)
    assert abs(p - 13 / 4096) < 1e-12


# ---------------------------------------------------------------------------
# Cohen's kappa
# ---------------------------------------------------------------------------

def test_cohen_kappa_reproduces_post_tx_kappa() -> None:
    """Reproduce the Post-Tx inter-rater kappa (0.625, substantial)."""
    eval1 = ["Lt", "Lt", "Lt", "Rt", "Rt", "Rt",
             "Lt", "Lt", "Lt", "Lt", "Lt", "Rt"]
    eval2 = ["Lt", "Lt", "Lt", "Rt", "Rt", "Lt",
             "Lt", "Lt", "Rt", "Lt", "Lt", "Rt"]
    res = cohen_kappa(eval1, eval2)
    assert abs(res.kappa - 0.625) < 0.001
    assert res.landis_koch == "substantial"
    assert res.n == 12


def test_cohen_kappa_reproduces_pre_tx_kappa() -> None:
    """Reproduce the Pre-Tx inter-rater kappa (0.831, almost perfect)."""
    eval1 = ["Rt", "Lt", "Rt", "Rt", "Rt", "Rt", "Rt",
             "Rt", "Rt", "Lt", "Lt", "Lt", "Rt"]
    eval2 = ["Rt", "Lt", "Rt", "Rt", "Rt", "Rt", "Lt",
             "Rt", "Rt", "Lt", "Lt", "Lt", "Rt"]
    res = cohen_kappa(eval1, eval2)
    assert abs(res.kappa - 0.831) < 0.01
    assert res.landis_koch == "almost perfect"
    assert res.n == 13


def test_cohen_kappa_perfect_agreement() -> None:
    """Identical ratings yield kappa = 1.0."""
    res = cohen_kappa(["a", "b", "a", "b"], ["a", "b", "a", "b"])
    assert res.kappa == 1.0


# ---------------------------------------------------------------------------
# Landis & Koch labels
# ---------------------------------------------------------------------------

def test_landis_koch_label_boundaries() -> None:
    """Benchmark labels agree with Landis & Koch (1977)."""
    assert landis_koch_label(-0.1) == "poor"
    assert landis_koch_label(0.10) == "slight"
    assert landis_koch_label(0.30) == "fair"
    assert landis_koch_label(0.50) == "moderate"
    assert landis_koch_label(0.70) == "substantial"
    assert landis_koch_label(0.90) == "almost perfect"
    assert landis_koch_label(1.00) == "almost perfect"
