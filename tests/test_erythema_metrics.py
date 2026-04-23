"""Unit tests for src.erythema_metrics."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src.erythema_metrics import (  # noqa: E402
    ERYTHEMA_THRESHOLD,
    erythema_area,
    erythema_density,
    mean_rg,
)


def test_erythema_threshold_is_50() -> None:
    """Pre-specified threshold must remain 50."""
    assert ERYTHEMA_THRESHOLD == 50.0


def test_erythema_area_simple() -> None:
    """Erythema area is the fraction of threshold-exceeding skin pixels."""
    # 4 skin pixels, 2 exceed threshold 50.
    rg = np.array([[60.0, 40.0], [70.0, 30.0]])
    skin = np.array([[True, True], [True, True]])
    assert erythema_area(rg, skin) == 0.5


def test_erythema_area_ignores_non_skin_pixels() -> None:
    """Non-skin pixels do not affect erythema area."""
    rg = np.array([[60.0, 999.0], [40.0, 999.0]])
    skin = np.array([[True, False], [True, False]])
    # 2 skin pixels; 1 exceeds threshold.
    assert erythema_area(rg, skin) == 0.5


def test_erythema_density_means_thresholded_pixels() -> None:
    """Density is the mean R-G over threshold-exceeding skin pixels.

    Uses enough pixels to exceed MIN_DENSITY_PIXELS (100).
    """
    rng = np.random.default_rng(42)
    # 200 skin pixels, all with R-G = 60 (above threshold 50).
    rg = np.full((20, 10), 60.0)
    skin = np.ones((20, 10), dtype=bool)
    assert erythema_density(rg, skin) == 60.0

    # Mixed values, only half above threshold.
    rg = np.zeros((30, 10))
    rg[:15] = 70.0   # 150 pixels above threshold
    rg[15:] = 30.0   # 150 pixels below threshold
    skin = np.ones((30, 10), dtype=bool)
    # Mean over above-threshold pixels = 70.
    assert erythema_density(rg, skin) == 70.0


def test_erythema_density_returns_zero_when_insufficient_pixels() -> None:
    """Density returns 0.0 when fewer than MIN_DENSITY_PIXELS exceed threshold."""
    rg = np.array([[60.0, 60.0], [30.0, 30.0]])
    skin = np.ones((2, 2), dtype=bool)
    # Only 2 pixels exceed threshold; below the MIN_DENSITY_PIXELS=100 threshold.
    assert erythema_density(rg, skin) == 0.0


def test_mean_rg_over_skin_pixels() -> None:
    """mean_rg computes the mean across skin pixels only."""
    rg = np.array([[10.0, 20.0], [30.0, 40.0]])
    skin = np.array([[True, True], [False, True]])
    assert mean_rg(rg, skin) == (10 + 20 + 40) / 3
