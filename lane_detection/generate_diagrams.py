#!/usr/bin/env python3
"""
Generate system architecture and flowchart diagrams.
Saves to output/architecture.png and output/flowchart.png
"""
import os
os.makedirs("output", exist_ok=True)

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe

# ─── Architecture Diagram ──────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(16, 10))
ax.set_xlim(0, 16)
ax.set_ylim(0, 10)
ax.axis("off")
fig.patch.set_facecolor("#0d1117")
ax.set_facecolor("#0d1117")

def box(ax, x, y, w, h, text, color, textcolor="white", fontsize=10, bold=False):
    rect = FancyBboxPatch((x, y), w, h,
                           boxstyle="round,pad=0.15",
                           facecolor=color, edgecolor="white",
                           linewidth=1.2, alpha=0.92)
    ax.add_patch(rect)
    weight = "bold" if bold else "normal"
    ax.text(x + w/2, y + h/2, text, ha="center", va="center",
            color=textcolor, fontsize=fontsize, fontweight=weight,
            wrap=True, multialignment="center")

def arrow(ax, x1, y1, x2, y2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color="#aaaaaa", lw=1.5))

# Title
ax.text(8, 9.5, "Vehicle & Lane Detection System — Architecture",
        ha="center", va="center", color="white", fontsize=14, fontweight="bold")

# Input
box(ax, 0.5, 7.5, 2.5, 1.2, "📹 Video Input\n(File / Webcam)", "#1e6b4a", fontsize=9, bold=True)

# Frame Capture
box(ax, 4.0, 7.5, 2.2, 1.2, "Frame\nCapture", "#1a4a7a", fontsize=9)

# Resize
box(ax, 7.2, 7.5, 2.0, 1.2, "Resize\n& Preprocess", "#1a4a7a", fontsize=9)

# Split
ax.text(11.5, 8.1, "Split", ha="center", va="center", color="#aaaaaa", fontsize=9)
ax.plot([11.5, 11.5], [7.5, 9.0], color="#555", lw=1, linestyle="--")

# Lane Detection branch
box(ax, 0.5, 5.0, 2.2, 1.8,
    "Lane Detection\n─────────\n1. Grayscale\n2. Gaussian Blur\n3. Canny Edges\n4. ROI Mask\n5. Hough Lines",
    "#2d5a1b", fontsize=7.5)

# Vehicle Detection branch
box(ax, 3.5, 5.0, 2.5, 1.8,
    "Vehicle Detection\n─────────\nYOLOv8n\n• Car\n• Bus / Truck\n• Motorcycle",
    "#5a1b2d", fontsize=7.5)

# Lane output
box(ax, 0.5, 3.0, 2.2, 1.4,
    "Lane Output\n─────────\n• Left/Right Lines\n• Lane Polygon\n• Curvature\n• Departure Warn",
    "#1e4a1a", fontsize=7.5)

# Vehicle output
box(ax, 3.5, 3.0, 2.5, 1.4,
    "Vehicle Output\n─────────\n• Bounding Boxes\n• Labels + Conf\n• Speed Est.\n• Count",
    "#4a1a2a", fontsize=7.5)

# Merge
box(ax, 7.0, 3.0, 2.2, 1.4, "Merge\nResults", "#3a3a1a", fontsize=9, bold=True)

# HUD
box(ax, 10.0, 3.0, 2.2, 1.4, "HUD Overlay\n─────────\nFPS · Counts\nWarnings", "#2a2a5a", fontsize=8)

# Output
box(ax, 12.5, 3.0, 2.8, 1.4, "📤 Output\n─────────\nDisplay Window\nSave MP4", "#1e6b4a", fontsize=8, bold=True)

# Arrows
arrow(ax, 3.0, 8.1, 4.0, 8.1)
arrow(ax, 6.2, 8.1, 7.2, 8.1)
arrow(ax, 9.2, 8.1, 10.5, 8.1)
# Down to branches
arrow(ax, 1.6, 7.5, 1.6, 6.8)
arrow(ax, 4.75, 7.5, 4.75, 6.8)
# Down to outputs
arrow(ax, 1.6, 5.0, 1.6, 4.4)
arrow(ax, 4.75, 5.0, 4.75, 4.4)
# Outputs to merge
arrow(ax, 2.7, 3.7, 7.0, 3.7)
arrow(ax, 6.0, 3.7, 7.0, 3.7)
# Merge to HUD to Output
arrow(ax, 9.2, 3.7, 10.0, 3.7)
arrow(ax, 12.2, 3.7, 12.5, 3.7)

ax.text(8, 0.4, "Models: YOLOv8n (COCO) · OpenCV 4.x · Python 3.9+",
        ha="center", color="#888", fontsize=9)

plt.tight_layout()
plt.savefig("output/architecture.png", dpi=150, bbox_inches="tight",
            facecolor="#0d1117")
plt.close()
print("Saved: output/architecture.png")

# ─── Flowchart ─────────────────────────────────────────────────────────────────
fig2, ax2 = plt.subplots(figsize=(10, 16))
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 17)
ax2.axis("off")
fig2.patch.set_facecolor("#0d1117")
ax2.set_facecolor("#0d1117")

ax2.text(5, 16.5, "Lane & Vehicle Detection — Flowchart",
         ha="center", va="center", color="white", fontsize=13, fontweight="bold")

steps = [
    (5, 15.5, "START",                      "#155a2a", True),
    (5, 14.0, "Load Video / Open Webcam",   "#1a4a7a", False),
    (5, 12.5, "Read Next Frame",            "#1a4a7a", False),
    (5, 11.0, "Frame Available?",           "#5a4a00", False),  # decision
    (5,  9.5, "Resize & Preprocess",        "#1a4a7a", False),
    # Lane branch
    (2,  8.0, "Grayscale + Blur",           "#1e4a1a", False),
    (2,  6.8, "Canny Edge Detection",       "#1e4a1a", False),
    (2,  5.6, "ROI Mask",                   "#1e4a1a", False),
    (2,  4.4, "Hough Transform",            "#1e4a1a", False),
    (2,  3.2, "Draw Lanes",                 "#1e4a1a", False),
    # Vehicle branch
    (7.5, 8.0, "YOLOv8 Inference",         "#4a1a2a", False),
    (7.5, 6.8, "Filter Vehicles",          "#4a1a2a", False),
    (7.5, 5.6, "Draw Bounding Boxes",      "#4a1a2a", False),
    (7.5, 4.4, "Speed / Count Update",     "#4a1a2a", False),
    # Merge
    (5,  2.0, "Merge + HUD Overlay",       "#3a3a1a", False),
    (5,  0.8, "Display / Save Frame",      "#155a2a", True),
]

for (x, y, label, color, bold) in steps:
    w = 3.5 if x == 5 else 2.8
    box(ax2, x - w/2, y - 0.45, w, 0.9, label, color, fontsize=8.5, bold=bold)

# Arrows (main flow)
for i in range(1, 4):
    arrow(ax2, 5, steps[i-1][1] - 0.45, 5, steps[i][1] + 0.45)

# Decision "No" → exit
ax2.annotate("No → END", xy=(7.5, 11.0), xytext=(7.5, 11.0),
             color="#ff6666", fontsize=8)
ax2.annotate("Yes ↓", xy=(5, 10.55), xytext=(4.3, 10.55),
             color="#88ff88", fontsize=8)
arrow(ax2, 5, 10.55, 5, 9.95)

# Split to branches
ax2.annotate("", xy=(2, 8.45), xytext=(5, 9.05),
             arrowprops=dict(arrowstyle="->", color="#aaaaaa", lw=1.3))
ax2.annotate("", xy=(7.5, 8.45), xytext=(5, 9.05),
             arrowprops=dict(arrowstyle="->", color="#aaaaaa", lw=1.3))

# Lane branch internal
for i in range(6, 10):
    arrow(ax2, 2, steps[i-1][1]-0.45, 2, steps[i][1]+0.45)
# Vehicle branch internal
for i in range(11, 14):
    arrow(ax2, 7.5, steps[i-1][1]-0.45, 7.5, steps[i][1]+0.45)

# Merge
ax2.annotate("", xy=(5, 2.45), xytext=(2, 3.2 - 0.45),
             arrowprops=dict(arrowstyle="->", color="#aaaaaa", lw=1.3))
ax2.annotate("", xy=(5, 2.45), xytext=(7.5, 4.4 - 0.45),
             arrowprops=dict(arrowstyle="->", color="#aaaaaa", lw=1.3))
arrow(ax2, 5, 1.55, 5, 1.25)

# Back loop
ax2.annotate("", xy=(9.2, 12.5), xytext=(9.2, 0.8),
             arrowprops=dict(arrowstyle="-", color="#555", lw=1.3, linestyle="dashed"))
ax2.annotate("", xy=(6.75, 12.5), xytext=(9.2, 12.5),
             arrowprops=dict(arrowstyle="->", color="#555", lw=1.3))
ax2.text(9.5, 6.5, "Next\nFrame", color="#666", fontsize=7.5, ha="center")

plt.tight_layout()
plt.savefig("output/flowchart.png", dpi=150, bbox_inches="tight",
            facecolor="#0d1117")
plt.close()
print("Saved: output/flowchart.png")
