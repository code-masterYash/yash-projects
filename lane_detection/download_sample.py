"""
Download a free sample highway video for testing.
Run: python download_sample.py
"""
import os
import urllib.request

SAMPLES = [
    # Public domain / CC0 road footage
    ("https://www.pexels.com/download/video/854200/", "videos/highway.mp4"),
    # Fallback: a small synthetic test video will be generated if download fails
]

def generate_synthetic_video(path="videos/highway.mp4", seconds=10, fps=30):
    """Generate a minimal synthetic road-like video for testing (no internet needed)."""
    import cv2
    import numpy as np
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w, h = 1280, 720
    writer = cv2.VideoWriter(path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    print(f"[INFO] Generating synthetic test video ({seconds}s @ {fps}fps)…")
    for i in range(seconds * fps):
        frame = np.zeros((h, w, 3), dtype=np.uint8)
        # Sky
        frame[:int(h*0.45)] = (130, 100, 60)
        # Road
        frame[int(h*0.45):] = (60, 60, 60)
        # Lane markings
        t = i / fps
        lx = int(w * 0.35 + 10 * np.sin(t * 0.5))
        rx = int(w * 0.65 + 10 * np.sin(t * 0.5))
        cv2.line(frame, (lx, h), (int(w*0.45), int(h*0.5)), (255, 255, 255), 6)
        cv2.line(frame, (rx, h), (int(w*0.55), int(h*0.5)), (255, 255, 255), 6)
        # Moving car rectangle
        cx = int(w * 0.5 + 80 * np.sin(t * 0.8))
        cy = int(h * 0.65 - 20 * np.sin(t * 1.2))
        cv2.rectangle(frame, (cx - 60, cy - 30), (cx + 60, cy + 30), (0, 100, 200), -1)
        # Frame counter
        cv2.putText(frame, f"Synthetic Frame {i+1}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (200, 200, 200), 2)
        writer.write(frame)
    writer.release()
    print(f"[INFO] Synthetic video saved to: {path}")

if __name__ == "__main__":
    os.makedirs("videos", exist_ok=True)
    generate_synthetic_video("videos/highway.mp4")
    print("\nNow run:")
    print("  python main.py --source videos/highway.mp4")
    print("\nFor a REAL road video, download a free one from:")
    print("  https://www.pexels.com/search/videos/highway/")
    print("  https://pixabay.com/videos/search/highway/")
    print("  https://www.videvo.net  (search: highway driving)")
    print("Save it to: videos/highway.mp4")
