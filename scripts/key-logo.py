#!/usr/bin/env python3
"""
Key a partner logo off its paper so it can sit on the cream ground.

Every partner logo in the repository is a raster that was exported on white.
Shown on the cream, each one carries a visible white rectangle — the same
defect as the black "SL" plate, only lighter. The fix is to key the paper off
and let the mark float on the page.

The paper is not flat. A JPEG export of a logo carries compression noise and,
for the SDW file, a blue frame; the corners of an opaque PNG sit at
rgb(240,245,240) while the middle sits at rgb(255,255,255). A constant matte
keys the corners unevenly and leaves a pale rim. So the paper is fitted as a
smooth surface instead: a degree-2 polynomial per channel, fitted only to the
near-white pixels.

Coverage is measured by projecting each pixel onto the ray from the local
paper colour toward each ink colour. A pixel that is a blend of paper and ink
f with coverage a satisfies C - B = a (f - B), so the projection is exactly a,
and the largest projection over the palette recovers the coverage even on
anti-aliased edges.

The recovered ink colour is the measured colour where coverage is solid, and
the palette colour at partial coverage. Un-matting a single blended pixel
back to its source colour amplifies the noise by 1/a, and it showed on the
first attempt: the edge pixels came out a median of 40/255 pale. The artwork
is flat colour, so the palette entry IS the truth at an edge.

The palette is recovered automatically (k-means over the ink pixels) so no
colour is hand-typed and cannot drift from the artwork.

    python3 scripts/key-logo.py SOURCE OUTPUT [--crop L T R B] [--name NAME]

Writes a tight-cropped RGBA PNG. Prints what it found, so a run that keyed
badly is visible in the log rather than in the footer.
"""
import argparse
import pathlib

import numpy as np
from PIL import Image


def fit_paper(rgb, h, w):
    """Fit the paper as a degree-2 polynomial surface, per channel."""
    ys, xs = np.mgrid[0:h, 0:w]
    xf = (xs / max(w - 1, 1)).ravel()
    yf = (ys / max(h - 1, 1)).ravel()

    cols = []
    for i in range(3):
        for j in range(3 - i):
            cols.append((xf**i) * (yf**j))
    basis = np.stack(cols, axis=1)

    paper = (rgb.min(axis=2) > 225) & (rgb.max(axis=2) < 255.02)
    idx = np.flatnonzero(paper.ravel())
    if idx.size > 30000:
        idx = idx[:: max(1, idx.size // 30000)]

    surface = np.empty((h, w, 3))
    for c in range(3):
        coef, *_ = np.linalg.lstsq(basis[idx], rgb[:, :, c].ravel()[idx], rcond=None)
        surface[:, :, c] = (basis @ coef).reshape(h, w)
    # The fit overshoots 255 in places, and a float over 255 cast to uint8
    # wraps to 0 - a black hole in the paper. Clamp before it can wrap.
    return np.clip(surface, 0, 255), paper


def recover_palette(rgb, surface, paper, k=8):
    """k-means over the ink pixels, then merge the near-duplicate clusters."""
    delta = rgb - surface
    dist = np.linalg.norm(delta, axis=2)
    solid = (~paper) & (dist > 0.45 * dist.max())
    samples = rgb[solid]
    if samples.shape[0] < 50:
        return np.array([[0.0, 0.0, 0.0]])

    samples = samples[:: max(1, samples.shape[0] // 20000)]
    centres = samples[np.linspace(0, samples.shape[0] - 1, k).astype(int)]
    for _ in range(30):
        d = ((samples[:, None, :] - centres[None, :, :]) ** 2).sum(axis=2)
        labels = d.argmin(axis=1)
        for j in range(k):
            member = samples[labels == j]
            if member.shape[0] > 0:
                centres[j] = member.mean(axis=0)
    order = np.argsort(-np.bincount(labels, minlength=k))
    palette = [centres[j] for j in order if (labels == j).sum() > 0]
    merged = []
    for c in palette:
        if not any(np.linalg.norm(c - m) < 26 for m in merged):
            merged.append(c)
    return np.array(merged)


def key(source, output, crop=None, label=""):
    im = Image.open(source).convert("RGBA")
    if crop:
        im = im.crop(crop)
    arr = np.asarray(im).astype(np.float64)
    h, w, _ = arr.shape
    rgb = arr[:, :, :3]

    surface, paper = fit_paper(rgb, h, w)
    resid = np.abs(rgb - surface).max(axis=2)
    palette = recover_palette(rgb, surface, paper)

    delta = rgb - surface
    projs = []
    for f in palette:
        v = f - surface
        denom = np.maximum((v * v).sum(axis=2), 1e-6)
        projs.append((delta * v).sum(axis=2) / denom)
    projs = np.stack(projs, axis=0)
    winner = projs.argmax(axis=0)
    best = projs.max(axis=0)

    alpha = np.clip(best, 0.0, 1.0)
    alpha[paper & (resid < 12)] = 0.0

    fg = np.empty_like(rgb)
    solid = alpha >= 0.98
    fg[solid] = rgb[solid]                            # measured: median error 1.0
    partial = (alpha > 0.0) & (~solid)
    for i, f in enumerate(palette):
        fg[partial & (winner == i)] = f               # the truth at an edge
    fg[alpha <= 0.0] = surface[alpha <= 0.0]

    out = np.dstack([fg, alpha * 255.0]).astype(np.uint8)
    mark = Image.fromarray(out)

    # Crop to the ink's bounding box, with a hair of breathing room.
    rows = np.where((alpha > 0.02).sum(axis=1) > 0)[0]
    cols = np.where((alpha > 0.02).sum(axis=0) > 0)[0]
    if rows.size == 0 or cols.size == 0:
        raise SystemExit(f"{label or source}: nothing left after keying")
    pad = 2
    box = (
        max(0, int(cols[0]) - pad),
        max(0, int(rows[0]) - pad),
        min(mark.size[0], int(cols[-1]) + 1 + pad),
        min(mark.size[1], int(rows[-1]) + 1 + pad),
    )
    mark = mark.crop(box)
    mark.save(output, optimize=True)

    # ── report ──────────────────────────────────────────────────────────────
    check = np.asarray(mark).astype(float)
    a = check[:, :, 3] / 255.0
    edge = (a > 0.02) & (a < 0.98)
    if edge.sum():
        d = np.abs(check[:, :, :3][edge][:, None, :] - palette[None, :, :]).max(axis=2)
        edge_med, edge_max = np.median(d.min(axis=1)), d.min(axis=1).max()
    else:
        edge_med = edge_max = 0.0
    print(
        f"{label or pathlib.Path(source).name}: {mark.size[0]}x{mark.size[1]}  "
        f"paper residual median {np.median(resid[paper]):.2f}  "
        f"palette {[f'#{int(c[0]):02x}{int(c[1]):02x}{int(c[2]):02x}' for c in palette]}  "
        f"edge distance median {edge_med:.1f} max {edge_max:.1f}  "
        f"transparent {int((a < 0.01).sum())}px  ink-on-transparent {int(((a < 0.01) & (check[:, :, :3].max(axis=2) < 200)).sum())}px"
    )


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("output")
    ap.add_argument("--crop", nargs=4, type=int, metavar=("L", "T", "R", "B"))
    ap.add_argument("--name", default="")
    args = ap.parse_args()
    key(args.source, args.output, tuple(args.crop) if args.crop else None, args.name)
