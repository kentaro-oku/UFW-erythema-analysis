"""
image_analysis.py
=================

Single-image analysis pipeline: load -> central crop -> skin mask ->
R - G computation -> erythema density and area.
"""

from __future__ import annotations

from typing import Dict, Optional

import numpy as np

from .erythema_metrics import (
    MIN_SKIN_PIXELS,
    erythema_area,
    erythema_density,
    mean_rg,
)
from .hemoglobin_index import (
    crop_center,
    hemoglobin_rg,
    load_image,
    skin_mask,
)


def analyze_image(path: str,
                  crop_w_frac: float = 0.70,
                  crop_h_frac: float = 0.80,
                  min_skin_pixels: int = MIN_SKIN_PIXELS
                  ) -> Optional[Dict[str, float]]:
    """Run the full analysis pipeline on a single lateral-view image.

    Parameters
    ----------
    path : str
        Path to the image file.
    crop_w_frac, crop_h_frac : float
        Central-region crop fractions.
    min_skin_pixels : int
        Minimum number of skin pixels required for analysis; images
        with fewer skin pixels are deemed unanalyzable and the function
        returns None.

    Returns
    -------
    dict or None
        Dictionary with keys:
            'n_skin'     : number of skin pixels
            'mean_rg'    : mean R - G across all skin pixels
            'density_50' : erythema density at threshold 50
            'area_50'    : erythema area at threshold 50
        Returns None if insufficient skin pixels.
    """
    img = load_image(path)
    img = crop_center(img, w_frac=crop_w_frac, h_frac=crop_h_frac)
    rg = hemoglobin_rg(img)
    skin = skin_mask(img)
    n_skin = int(np.sum(skin))
    if n_skin < min_skin_pixels:
        return None
    return {
        "n_skin": n_skin,
        "mean_rg": mean_rg(rg, skin),
        "density_50": erythema_density(rg, skin),
        "area_50": erythema_area(rg, skin),
    }
