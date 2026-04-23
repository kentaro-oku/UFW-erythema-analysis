"""
example_single_image.py
=======================

Minimal example of applying the image-analysis pipeline to a single
lateral-view hemoglobin-enhanced image.

Usage
-----
    python scripts/example_single_image.py path/to/image.jpg
"""

from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT))

from src.image_analysis import analyze_image  # noqa: E402


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: python scripts/example_single_image.py <image_path>")
        sys.exit(2)

    image_path = sys.argv[1]
    features = analyze_image(image_path)
    if features is None:
        print(f"Image rejected (insufficient skin pixels): {image_path}")
        sys.exit(1)

    print(f"Image: {image_path}")
    print(f"  Skin pixels     : {features['n_skin']:,}")
    print(f"  Mean R-G        : {features['mean_rg']:.3f}")
    print(f"  Erythema density: {features['density_50']:.3f}  "
          f"(mean R-G of pixels with R-G > 50)")
    print(f"  Erythema area   : {features['area_50']:.4f}  "
          f"(fraction of skin pixels with R-G > 50)")


if __name__ == "__main__":
    main()
