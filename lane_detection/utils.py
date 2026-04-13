"""
Utilities Module
Handles HUD overlay, FPS counter, video I/O helpers, and diagnostics.
"""

import cv2
import numpy as np
import time
from collections import deque


class FPSCounter:
    def __init__(self, buffer=30):
        self.timestamps = deque(maxlen=buffer)

    def tick(self):
        self.timestamps.append(time.time())

    def get_fps(self):
        if len(self.timestamps) < 2:
            return 0.0
        elapsed = self.timestamps[-1] - self.timestamps[0]
        return (len(self.timestamps) - 1) / elapsed if elapsed > 0 else 0.0


def draw_hud(frame, fps, vehicle_counts, curvature, warning,
             speeds=None, total_vehicles=0):
    """
    Draw a semi-transparent HUD panel with all stats.
    """
    h, w = frame.shape[:2]
    overlay = frame.copy()

    # --- Top-left HUD panel ---
    panel_w, panel_h = 260, 220
    cv2.rectangle(overlay, (10, 10), (10 + panel_w, 10 + panel_h), (20, 20, 20), -1)
    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)

    y = 35
    def put(text, color=(220, 220, 220), scale=0.55, bold=1):
        nonlocal y
        cv2.putText(frame, text, (18, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, bold, cv2.LINE_AA)
        y += 22

    put("VEHICLE & LANE DETECTION", (100, 220, 100), 0.52, 2)
    put(f"FPS:  {fps:5.1f}", (180, 255, 180))
    put(f"Road: {curvature}", (255, 220, 100))
    put(f"Total detected: {total_vehicles}", (180, 220, 255))
    y += 4
    put("Vehicles:", (200, 200, 200))
    label_colors = {
        "car":        (0, 165, 255),
        "motorcycle": (255, 0, 255),
        "bus":        (50, 50, 255),
        "truck":      (50, 50, 255),
    }
    for label, count in vehicle_counts.items():
        c = label_colors.get(label, (200, 200, 200))
        put(f"  {label.capitalize():<12}: {count}", c)

    # --- Lane departure warning banner ---
    if warning:
        banner_y = h - 70
        cv2.rectangle(frame, (0, banner_y), (w, banner_y + 50), (0, 0, 180), -1)
        cv2.putText(frame, warning, (w // 2 - 220, banner_y + 33),
                    cv2.FONT_HERSHEY_DUPLEX, 0.85, (255, 255, 255), 2, cv2.LINE_AA)

    # --- Timestamp bottom-right ---
    ts = time.strftime("%H:%M:%S")
    cv2.putText(frame, ts, (w - 110, h - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (160, 160, 160), 1, cv2.LINE_AA)

    return frame


def get_video_writer(output_path, fps, frame_size):
    """Create an OpenCV VideoWriter with H.264 or fallback codec."""
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(output_path, fourcc, fps, frame_size)
    if not writer.isOpened():
        fourcc = cv2.VideoWriter_fourcc(*"XVID")
        writer = cv2.VideoWriter(output_path.replace(".mp4", ".avi"), fourcc, fps, frame_size)
    return writer


def resize_frame(frame, target_width=1280):
    """Resize frame maintaining aspect ratio."""
    h, w = frame.shape[:2]
    if w <= target_width:
        return frame
    scale = target_width / w
    return cv2.resize(frame, (target_width, int(h * scale)))


def draw_demo_lanes(frame):
    """
    Draw synthetic lane lines for demo mode (no real video).
    Used when no video source is provided.
    """
    h, w = frame.shape[:2]
    left_x  = int(w * 0.30)
    right_x = int(w * 0.70)
    cv2.line(frame, (left_x,  h), (int(w * 0.45), int(h * 0.55)), (0, 255, 0), 4)
    cv2.line(frame, (right_x, h), (int(w * 0.55), int(h * 0.55)), (0, 255, 0), 4)
    return frame


def print_summary(vehicle_counts, total_frames, elapsed):
    """Print processing summary to console."""
    print("\n" + "=" * 50)
    print("  PROCESSING COMPLETE")
    print("=" * 50)
    print(f"  Total frames processed : {total_frames}")
    print(f"  Total time             : {elapsed:.1f}s")
    print(f"  Average FPS            : {total_frames / elapsed:.1f}")
    print("\n  Vehicle detections:")
    for label, count in vehicle_counts.items():
        print(f"    {label.capitalize():<14}: {count}")
    print("=" * 50)
