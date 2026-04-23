"""
hemoglobin_index.py
===================

Hemoglobin-index computation and skin-pixel segmentation.

The hemoglobin index used in this study is the per-pixel difference
between the red and green channels of an RGB image (R - G). This
chromatic difference reflects the relative contribution of oxyhemoglobin
absorption in the red wavelength band, which is the physical principle
underlying the commercial hemoglobin-enhanced imaging mode of the
Re-Beau2 skin analyzer (JMEC Co., Ltd., Tokyo, Japan).

Skin pixels are identified by a color-space mask with empirically
calibrated bounds (see Methods of the accompanying manuscript):

    R in [80, 250]
    G in [40, 220]
    R - G > -10

Pixels failing this mask (hair, background, shadow, extreme highlights)
are excluded from all downstream computations.
"""

from __future__ import annotations

import numpy as np
from PIL import Image


# Empirically calibrated skin-pixel segmentation bounds.
# These are the values used for the manuscript analysis and should
# not be changed without re-validation against the calibration set.
SKIN_R_MIN: int = 80
SKIN_R_MAX: int = 250
SKIN_G_MIN: int = 40
SKIN_G_MAX: int = 220
SKIN_RG_MIN: float = -10.0

# Central-region crop fractions (exclude peripheral imaging artifacts).
CROP_W_FRAC: float = 0.70
CROP_H_FRAC: float = 0.80


def load_image(path: str) -> np.ndarray:
    """Load an RGB image as a uint8 ndarray of shape (H, W, 3).

    Parameters
    ----------
    path : str
        Path to the image file (JPEG, PNG, or any format supported by PIL).

    Returns
    -------
    np.ndarray
        uint8 array of shape (H, W, 3) in RGB order.
    """
    with Image.open(path) as img:
        return np.array(img.convert("RGB"))


def crop_center(img: np.ndarray,
                w_frac: float = CROP_W_FRAC,
                h_frac: float = CROP_H_FRAC) -> np.ndarray:
    """Crop the central w_frac x h_frac region of an image.

    Parameters
    ----------
    img : np.ndarray
        RGB image as (H, W, 3).
    w_frac, h_frac : float
        Fractions of width and height to retain, centered.

    Returns
    -------
    np.ndarray
        Cropped RGB image.
    """
    h, w = img.shape[:2]
    y0 = int(h * (1 - h_frac) / 2)
    y1 = int(h * (1 + h_frac) / 2)
    x0 = int(w * (1 - w_frac) / 2)
    x1 = int(w * (1 + w_frac) / 2)
    return img[y0:y1, x0:x1]


def hemoglobin_rg(img: np.ndarray) -> np.ndarray:
    """Compute the per-pixel hemoglobin index (R - G).

    Parameters
    ----------
    img : np.ndarray
        RGB image as (H, W, 3), uint8 or float.

    Returns
    -------
    np.ndarray
        Float array of shape (H, W) giving R - G for each pixel.
    """
    r = img[:, :, 0].astype(float)
    g = img[:, :, 1].astype(float)
    return r - g


def skin_mask(img: np.ndarray,
              r_min: int = SKIN_R_MIN, r_max: int = SKIN_R_MAX,
              g_min: int = SKIN_G_MIN, g_max: int = SKIN_G_MAX,
              rg_min: float = SKIN_RG_MIN) -> np.ndarray:
    """Boolean mask of skin pixels based on RGB color bounds.

    Parameters
    ----------
    img : np.ndarray
        RGB image as (H, W, 3).
    r_min, r_max : int
        Inclusive-exclusive bounds on the red channel.
    g_min, g_max : int
        Inclusive-exclusive bounds on the green channel.
    rg_min : float
        Lower bound on R - G (typically slightly negative to admit
        faintly greenish skin tones while excluding hair and background).

    Returns
    -------
    np.ndarray
        Boolean array of shape (H, W) where True indicates a skin pixel.
    """
    r = img[:, :, 0].astype(float)
    g = img[:, :, 1].astype(float)
    rg = r - g
    return (
        (r >= r_min) & (r < r_max)
        & (g >= g_min) & (g < g_max)
        & (rg > rg_min)
    )
