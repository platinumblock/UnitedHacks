import cv2
import numpy as np

def place_dots_on_streets(input_map_path, output_dots_path, dot_spacing=20, dot_radius=3, dot_color=255):
    # Load the black-and-white map image
    map_img = cv2.imread(input_map_path, cv2.IMREAD_GRAYSCALE)
    if map_img is None:
        raise FileNotFoundError(f"Input map file '{input_map_path}' not found.")

    # Threshold the image to create a binary map
    _, binary_map = cv2.threshold(map_img, 128, 255, cv2.THRESH_BINARY_INV)

    # Detect edges using Canny to identify street edges
    edges = cv2.Canny(binary_map, 50, 150)

    # Skeletonize the binary map to get centerlines
    skeleton = cv2.ximgproc.thinning(binary_map)

    # Create an empty image for dots
    dots_img = np.zeros_like(binary_map, dtype=np.uint8)

    # Place dots along the centerlines
    # Get coordinates of all pixels that are part of the skeleton
    points = np.column_stack(np.where(skeleton > 0))

    for i, (y, x) in enumerate(points):
        if i % dot_spacing == 0:
            cv2.circle(dots_img, (x, y), dot_radius, dot_color, -1)

    # Save the resulting dots image
    cv2.imwrite(output_dots_path, dots_img)

if __name__ == "__main__":
    # Input and output file paths
    input_map = "map.png"
    output_dots = "dots.png"

    # Call the function to place dots
    try:
        place_dots_on_streets(input_map, output_dots)
        print(f"Dots image saved as '{output_dots}'.")
    except Exception as e:
        print(f"An error occurred: {e}")