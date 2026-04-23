"""Unit tests for src.hemoglobin_index."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src.hemoglobin_index import (  # noqa: E402
    CROP_H_FRAC,
    CROP_W_FRAC,
    crop_center,
    hemoglobin_rg,
    skin_mask,
)


def test_hemoglobin_rg_basic() -> None:
    """R - G computation on a synthetic image."""
    # 2x2 image with known values.
    img = np.array(
        [[[100, 50, 0], [150, 80, 0]],
         [[200, 100, 0], [50, 60, 0]]],
        dtype=np.uint8,
    )
    rg = hemoglobin_rg(img)
    expected = np.array([[50.0, 70.0], [100.0, -10.0]])
    np.testing.assert_array_equal(rg, expected)


def test_crop_center_dimensions() -> None:
    """Central crop yields the expected fractional dimensions."""
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    cropped = crop_center(img)
    h, w = cropped.shape[:2]
    assert abs(h - int(100 * CROP_H_FRAC)) <= 1
    assert abs(w - int(100 * CROP_W_FRAC)) <= 1


def test_crop_center_symmetric() -> None:
    """Central crop removes an approximately equal number of rows/cols
    from top/bottom and left/right.

    Uses only positive, non-zero pixels so that no spurious ties occur.
    """
    # 200x200 image filled with a constant skin-like RGB.
    img = np.full((200, 200, 3), 128, dtype=np.uint8)
    # Mark the center 11x11 region with a distinctive color.
    img[95:106, 95:106] = [200, 150, 130]
    cropped = crop_center(img)
    cy, cx = cropped.shape[0] // 2, cropped.shape[1] // 2
    # The landmark center region must still be present at the geometric
    # center of the cropped image (allowing for rounding by up to 1 pixel).
    assert cropped[cy, cx, 0] == 200
    assert cropped[cy, cx, 1] == 150
    assert cropped[cy, cx, 2] == 130


def test_skin_mask_accepts_typical_skin() -> None:
    """Typical facial skin RGB values are accepted."""
    # Typical light-to-medium skin: R=200, G=150, so R-G=50 > -10.
    img = np.array([[[200, 150, 130]]], dtype=np.uint8)
    mask = skin_mask(img)
    assert bool(mask[0, 0]) is True


def test_skin_mask_rejects_dark_background() -> None:
    """Near-black background is rejected."""
    img = np.array([[[30, 30, 30]]], dtype=np.uint8)
    mask = skin_mask(img)
    assert bool(mask[0, 0]) is False


def test_skin_mask_rejects_bright_highlight() -> None:
    """Overexposed highlight (R >= 250) is rejected."""
    img = np.array([[[255, 200, 200]]], dtype=np.uint8)
    mask = skin_mask(img)
    assert bool(mask[0, 0]) is False


def test_skin_mask_rejects_green_cast() -> None:
    """Pixels with strongly negative R - G are rejected."""
    # G > R by more than 10: R-G = -20 < -10 threshold.
    img = np.array([[[100, 120, 80]]], dtype=np.uint8)
    mask = skin_mask(img)
    assert bool(mask[0, 0]) is False
