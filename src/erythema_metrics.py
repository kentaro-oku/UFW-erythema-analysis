"""
erythema_metrics.py
===================

Erythema-quantification metrics derived from the R - G hemoglobin index.

Two complementary metrics are computed, with a pre-specified fixed
threshold of R - G > 50 to isolate clinically meaningful erythema from
background skin tone:

    (1) Erythema density
        mean R - G among skin pixels exceeding the threshold.
        Intended to capture the *intensity* of erythema within
        already-established erythematous foci.

    (2) Erythema area
        fraction of skin pixels exceeding the threshold relative to the
        total number of skin pixels.
        Intended to capture the *spatial extent* of erythema.

The threshold of 50 was empirically selected during method development
on a calibration subset prior to the main analysis and is held fixed
throughout. See docs/METHODOLOGY.md for rationale.
"""

from __future__ import annotations

from typing import Optional

import numpy as np


# Pre-specified, fixed erythema threshold on the R - G channel.
ERYTHEMA_THRESHOLD: float = 50.0

# Minimum number of skin pixels required for the image to be considered analyzable.
MIN_SKIN_PIXELS: int = 1000

# Minimum number of threshold-exceeding pixels required to compute a
# meaningful mean density. If fewer pixels exceed the threshold,
# density is undefined and returned as 0.0 by convention.
MIN_DENSITY_PIXELS: int = 100


def erythema_density(rg: np.ndarray,
                     skin: np.ndarray,
                     threshold: float = ERYTHEMA_THRESHOLD,
                     min_pixels: int = MIN_DENSITY_PIXELS) -> float:
    """Mean R - G of skin pixels exceeding the erythema threshold.

    Parameters
    ----------
    rg : np.ndarray
        Per-pixel R - G difference (H, W).
    skin : np.ndarray
        Boolean skin mask (H, W).
    threshold : float, optional
        Erythema threshold on R - G. Default is the pre-specified 50.
    min_pixels : int, optional
        Minimum number of threshold-exceeding pixels required.

    Returns
    -------
    float
        Mean R - G of the thresholded erythematous pixels, or 0.0 if
        fewer than `min_pixels` pixels exceed the threshold.
    """
    rg_skin = rg[skin]
    above = rg_skin > threshold
    n_above = int(np.sum(above))
    if n_above < min_pixels:
        return 0.0
    return float(np.mean(rg_skin[above]))


def erythema_area(rg: np.ndarray,
                  skin: np.ndarray,
                  threshold: float = ERYTHEMA_THRESHOLD) -> float:
    """Fraction of skin pixels exceeding the erythema threshold.

    Parameters
    ----------
    rg : np.ndarray
        Per-pixel R - G difference (H, W).
    skin : np.ndarray
        Boolean skin mask (H, W).
    threshold : float, optional
        Erythema threshold on R - G. Default is the pre-specified 50.

    Returns
    -------
    float
        Proportion of skin pixels exceeding the threshold (range 0..1).
        Returns NaN if the image contains no skin pixels.
    """
    n_skin = int(np.sum(skin))
    if n_skin == 0:
        return float("nan")
    rg_skin = rg[skin]
    n_above = int(np.sum(rg_skin > threshold))
    return n_above / n_skin


def mean_rg(rg: np.ndarray, skin: np.ndarray) -> Optional[float]:
    """Mean R - G across all skin pixels (no threshold).

    Included as a reference metric. Not the primary outcome metric in
    the present study; see docs/METHODOLOGY.md for the rationale of the
    thresholded metrics.
    """
    if int(np.sum(skin)) == 0:
        return None
    return float(np.mean(rg[skin]))
