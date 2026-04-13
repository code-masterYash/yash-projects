"""
Vehicle Detection Module
Uses YOLOv8 for real-time detection of cars, buses, trucks, motorcycles.
Includes vehicle counting and optional speed estimation.
"""

import cv2
import numpy as np
import time
from collections import defaultdict

# YOLO class IDs for vehicles (COCO dataset)
VEHICLE_CLASSES = {
    2:  ("car",        (0, 165, 255)),   # Orange
    3:  ("motorcycle", (255, 0, 255)),   # Magenta
    5:  ("bus",        (255, 50,  50)),  # Red
    7:  ("truck",      (50,  50, 255)),  # Blue
}


class VehicleDetector:
    def __init__(self, model_path="models/yolov8n.pt", confidence=0.40, device="cpu"):
        """
        Initialize YOLO vehicle detector.
        model_path: path to .pt model file (auto-downloaded if missing)
        confidence: minimum detection confidence
        device: 'cpu' or 'cuda'
        """
        self.confidence = confidence
        self.device = device
        self.model = None
        self.vehicle_count = defaultdict(int)
        self.tracked_vehicles = {}   # id → history for speed estimation
        self.frame_times = []
        self._load_model(model_path)

    def _load_model(self, model_path):
        """Load YOLOv8 model; auto-download if not found."""
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_path)
            print(f"[INFO] YOLO model loaded from: {model_path}")
        except FileNotFoundError:
            from ultralytics import YOLO
            print(f"[INFO] Downloading YOLOv8n model...")
            self.model = YOLO("yolov8n.pt")
            print("[INFO] Model downloaded and loaded.")
        except ImportError:
            print("[ERROR] ultralytics not installed. Run: pip install ultralytics")
            self.model = None

    def detect(self, frame):
        """
        Run vehicle detection on a frame.
        Returns list of detections: [(x1,y1,x2,y2, label, confidence, color), ...]
        """
        if self.model is None:
            return []

        results = self.model(frame, verbose=False, conf=self.confidence, device=self.device)
        detections = []

        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                if cls_id not in VEHICLE_CLASSES:
                    continue
                conf  = float(box.conf[0])
                label, color = VEHICLE_CLASSES[cls_id]
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                detections.append((x1, y1, x2, y2, label, conf, color))
                self.vehicle_count[label] += 1

        return detections

    def draw_detections(self, frame, detections):
        """Draw bounding boxes, labels, and confidence scores on frame."""
        for (x1, y1, x2, y2, label, conf, color) in detections:
            # Bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # Label background
            text = f"{label.upper()} {conf:.0%}"
            (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
            cv2.rectangle(frame, (x1, y1 - th - 10), (x1 + tw + 6, y1), color, -1)

            # Label text
            cv2.putText(frame, text, (x1 + 3, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2, cv2.LINE_AA)

        return frame

    def get_vehicle_counts(self):
        """Return per-class vehicle counts (resets each frame for real-time count)."""
        return dict(self.vehicle_count)

    def reset_frame_counts(self):
        """Reset per-frame counts (call at start of each frame)."""
        self.vehicle_count = defaultdict(int)


class SpeedEstimator:
    """
    Simple speed estimator using bounding box displacement between frames.
    Assumes a known pixels-per-meter ratio and frame rate.
    """
    def __init__(self, ppm=8.0, fps=30):
        """
        ppm: pixels per meter (calibrate for your video)
        fps: frames per second of the video
        """
        self.ppm = ppm
        self.fps = fps
        self.prev_centers = {}
        self.speeds = {}

    def update(self, detections, frame_idx):
        current_centers = {}
        for i, (x1, y1, x2, y2, label, conf, color) in enumerate(detections):
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            current_centers[i] = (cx, cy, label)

        for vid, (cx, cy, label) in current_centers.items():
            if vid in self.prev_centers:
                px, py, _ = self.prev_centers[vid]
                pixel_dist = np.sqrt((cx - px) ** 2 + (cy - py) ** 2)
                meters = pixel_dist / self.ppm
                speed_mps = meters * self.fps
                speed_kph = speed_mps * 3.6
                self.speeds[vid] = min(speed_kph, 200)  # Cap at 200 km/h

        self.prev_centers = current_centers
        return self.speeds
