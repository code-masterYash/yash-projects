import cv2
import numpy as np

def region_of_interest(img):
    height = img.shape[0]
    width = img.shape[1]

    # Triangle covering only road area
    polygons = np.array([
        [(0, height),
         (width, height),
         (width//2, int(height*0.55))]
    ])

    mask = np.zeros_like(img)
    cv2.fillPoly(mask, polygons, 255)

    masked = cv2.bitwise_and(img, mask)
    return masked


def process_lane_detection(frame):

    # Convert to gray
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Blur to remove noise
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # Edge detection
    edges = cv2.Canny(blur, 50, 150)

    # Apply ROI mask
    cropped_edges = region_of_interest(edges)

    # Detect lines
    lines = cv2.HoughLinesP(
        cropped_edges,
        2,
        np.pi/180,
        100,
        minLineLength=40,
        maxLineGap=50
    )

    line_image = np.zeros_like(frame)

    if lines is not None:
        for line in lines:
            x1,y1,x2,y2 = line[0]

            # ignore horizontal lines
            if abs(y2 - y1) < 20:
                continue

            cv2.line(line_image,(x1,y1),(x2,y2),(0,255,0),5)

    # combine with original frame
    annotated = cv2.addWeighted(frame,0.8,line_image,1,1)

    left_lane = None
    right_lane = None
    curvature = "Straight"
    warning = ""

    return annotated, left_lane, right_lane, curvature, warning