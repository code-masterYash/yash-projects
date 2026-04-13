# 🚗 Vehicle & Lane Detection System

A real-time computer vision pipeline that detects **road lanes** and **vehicles** (cars, buses, trucks, motorcycles) using **OpenCV** + **YOLOv8**.

---

## 📁 Project Structure

```
vehicle_lane_detection_project/
│
├── main.py               ← Full pipeline entry point
├── lane_detection.py     ← Classical CV lane detection
├── vehicle_detection.py  ← YOLOv8 vehicle detection
├── utils.py              ← HUD, FPS counter, video I/O
├── download_sample.py    ← Generate/download test video
├── requirements.txt
│
├── models/
│   └── yolov8n.pt        ← Auto-downloaded on first run
│
├── videos/
│   └── highway.mp4       ← Your input video (see below)
│
└── output/
    └── result_video.mp4  ← Processed output
```

---

## ⚙️ Installation

```bash
# 1. Clone / unzip the project
cd vehicle_lane_detection_project

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

---

## 🎬 Get a Test Video

**Option A — Auto-generate a synthetic video (no internet):**
```bash
python download_sample.py
```

**Option B — Use a real road video:**
Download any free highway dashcam video from:
- https://www.pexels.com/search/videos/highway/
- https://pixabay.com/videos/search/highway/
- https://www.videvo.net

Save it as `videos/highway.mp4`.

---

## 🚀 Running the System

```bash
# Process a video file
python main.py --source videos/highway.mp4

# Use webcam
python main.py --source 0

# Save output without showing window (headless / Colab)
python main.py --source videos/highway.mp4 --no-display

# Enable speed estimation
python main.py --source videos/highway.mp4 --speed

# Custom confidence threshold
python main.py --source videos/highway.mp4 --confidence 0.5

# Full options
python main.py --help
```

---

## 🖥️ Output

The processed video shows:
- 🟢 **Green lane lines** with filled lane polygon
- 🟠 **Orange bounding boxes** around cars
- 🔵 **Blue bounding boxes** around trucks/buses
- 🟣 **Magenta bounding boxes** around motorcycles
- **HUD panel**: FPS · road curvature · vehicle counts
- **⚠ Lane departure warning** banner when drifting

---

## 🔬 Algorithm Overview

### Lane Detection (Classical CV)
```
Frame → Grayscale → Gaussian Blur → Canny Edges
     → ROI Mask → Hough Lines → Left/Right Split
     → Weighted Average → Draw on Frame
```

### Vehicle Detection (Deep Learning)
```
Frame → YOLOv8n Inference → Filter Vehicle Classes
     → Draw Bounding Boxes → Label + Confidence
```

---

## ⚡ Performance Tips

| Tip | Effect |
|-----|--------|
| Use `yolov8n.pt` (nano) | Fastest inference |
| Set `--width 640` | Half-res = ~2× faster |
| Add `--no-display` | Skip rendering overhead |
| Use GPU: set `device="cuda"` in `vehicle_detection.py` | 10–30× faster |
| Use `yolov8s.pt` for better accuracy | Slower but more accurate |

---

## 🔧 Advanced Features (enabled by flags)

| Feature | Flag / Setting |
|---------|---------------|
| Speed estimation | `--speed` |
| Lane curvature | Always active |
| Lane departure warning | Always active |
| Vehicle counting | Always active |
| Headless (no window) | `--no-display` |

---

## 🐍 Google Colab

```python
!pip install ultralytics opencv-python-headless numpy matplotlib
!python main.py --source videos/highway.mp4 --no-display
from IPython.display import Video
Video("output/result_video.mp4")
```

---

## 📊 Class IDs (COCO)

| Class | ID | Color |
|-------|----|-------|
| Car | 2 | Orange |
| Motorcycle | 3 | Magenta |
| Bus | 5 | Red |
| Truck | 7 | Blue |

---

## 📄 License
MIT — free for personal and commercial use.
