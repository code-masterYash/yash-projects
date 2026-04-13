"""
Vehicle and Lane Detection System — Main Pipeline
==================================================
Usage:
  python main.py                          # webcam
  python main.py --source videos/highway.mp4
  python main.py --source videos/highway.mp4 --output output/result_video.mp4
  python main.py --source videos/highway.mp4 --no-display
"""

import cv2
import numpy as np
import argparse
import time
import os
import sys

from lane_detection import process_lane_detection
from vehicle_detection import VehicleDetector, SpeedEstimator
from utils import FPSCounter, draw_hud, get_video_writer, resize_frame, print_summary


# ─────────────────────────────────────────────
# Argument Parser
# ─────────────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(description="Vehicle & Lane Detection System")
    parser.add_argument("--source",     default="0",
                        help="Video path or '0' for webcam (default: webcam)")
    parser.add_argument("--output",     default="output/result_video.mp4",
                        help="Output video path (default: output/result_video.mp4)")
    parser.add_argument("--model",      default="models/yolov8n.pt",
                        help="YOLO model path (default: models/yolov8n.pt)")
    parser.add_argument("--confidence", type=float, default=0.40,
                        help="Detection confidence threshold (default: 0.40)")
    parser.add_argument("--width",      type=int, default=1280,
                        help="Processing width in pixels (default: 1280)")
    parser.add_argument("--no-display", action="store_true",
                        help="Run headlessly without showing window")
    parser.add_argument("--no-save",    action="store_true",
                        help="Do not save output video")
    parser.add_argument("--speed",      action="store_true",
                        help="Enable speed estimation (experimental)")
    return parser.parse_args()


# ─────────────────────────────────────────────
# Video Source Helper
# ─────────────────────────────────────────────
def open_video_source(source_arg):
    """Open webcam or video file. Returns (cap, is_file, fps, frame_size)."""
    if source_arg.isdigit():
        cap = cv2.VideoCapture(int(source_arg))
        is_file = False
    else:
        if not os.path.exists(source_arg):
            print(f"[ERROR] Video file not found: {source_arg}")
            print("  → Provide a valid path or run: python download_sample.py")
            sys.exit(1)
        cap = cv2.VideoCapture(source_arg)
        is_file = True

    if not cap.isOpened():
        print("[ERROR] Cannot open video source.")
        sys.exit(1)

    fps        = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_w    = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_h    = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    return cap, is_file, fps, (frame_w, frame_h)


# ─────────────────────────────────────────────
# Main Pipeline
# ─────────────────────────────────────────────
def run(args):
    print("\n" + "=" * 55)
    print("  Vehicle & Lane Detection System — Starting")
    print("=" * 55)

    # ── Open video source ──
    cap, is_file, src_fps, src_size = open_video_source(args.source)
    print(f"  Source  : {'File: ' + args.source if is_file else 'Webcam'}")
    print(f"  FPS     : {src_fps:.1f}   |   Resolution: {src_size[0]}×{src_size[1]}")

    # ── Initialise detectors ──
    detector = VehicleDetector(
        model_path=args.model,
        confidence=args.confidence
    )
    speed_estimator = SpeedEstimator(fps=src_fps) if args.speed else None
    fps_counter = FPSCounter()

    # ── Prepare output writer ──
    writer      = None
    output_path = None
    if not args.no_save:
        os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
        output_path = args.output
        # Writer will be created after first frame (so we know exact size)

    # ── Window ──
    win_name = "Vehicle & Lane Detection"
    if not args.no_display:
        cv2.namedWindow(win_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(win_name, 1280, 720)

    # ── Processing loop ──
    total_frames   = 0
    cumulative_cnt = {}
    start_time     = time.time()

    print("\n  Press Q to quit.\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            if is_file:
                print("[INFO] End of video.")
            break

        # Resize for consistent processing
        frame = resize_frame(frame, args.width)

        # ── Lane Detection ──
        annotated, left_line, right_line, curvature, warning = process_lane_detection(frame)

        # ── Vehicle Detection ──
        detector.reset_frame_counts()
        detections = detector.detect(annotated)
        annotated  = detector.draw_detections(annotated, detections)

        # ── Speed Estimation (optional) ──
        speeds = {}
        if speed_estimator:
            speeds = speed_estimator.update(detections, total_frames)
            # Draw speed tags
            for vid_id, spd in speeds.items():
                if vid_id < len(detections):
                    x1, y1, x2, y2, *_ = detections[vid_id]
                    cv2.putText(annotated, f"{spd:.0f} km/h",
                                (x1, y2 + 18), cv2.FONT_HERSHEY_SIMPLEX,
                                0.5, (0, 255, 255), 1, cv2.LINE_AA)

        # ── Update cumulative counts ──
        for label, cnt in detector.get_vehicle_counts().items():
            cumulative_cnt[label] = cumulative_cnt.get(label, 0) + cnt

        # ── FPS ──
        fps_counter.tick()
        current_fps = fps_counter.get_fps()

        # ── HUD Overlay ──
        total_in_frame = len(detections)
        annotated = draw_hud(
            annotated,
            fps=current_fps,
            vehicle_counts=detector.get_vehicle_counts(),
            curvature=curvature,
            warning=warning,
            speeds=speeds,
            total_vehicles=total_in_frame
        )

        # ── Initialise writer on first frame ──
        if writer is None and not args.no_save:
            h, w = annotated.shape[:2]
            writer = get_video_writer(output_path, src_fps, (w, h))
            print(f"  Saving  : {output_path}")

        if writer:
            writer.write(annotated)

        # ── Display ──
        if not args.no_display:
            cv2.imshow(win_name, annotated)
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q") or key == 27:
                print("\n[INFO] User requested exit.")
                break

        total_frames += 1

        # Progress every 100 frames
        if total_frames % 100 == 0:
            elapsed = time.time() - start_time
            print(f"  Frame {total_frames:5d}  |  FPS {current_fps:5.1f}  |  "
                  f"Elapsed {elapsed:.0f}s")

    # ── Cleanup ──
    cap.release()
    if writer:
        writer.release()
    cv2.destroyAllWindows()

    elapsed = time.time() - start_time
    print_summary(cumulative_cnt, total_frames, elapsed)

    if output_path and not args.no_save:
        print(f"\n  ✓ Output saved to: {output_path}")

    return 0


# ─────────────────────────────────────────────
if __name__ == "__main__":
    args = parse_args()
    sys.exit(run(args))
