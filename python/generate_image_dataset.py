import os
import sys
import zipfile
import cv2
import numpy as np

# Paths
DOG_IMAGE_PATH = "public/dog.png"
OUTPUT_FOLDER = "tmp/dog_images"
ZIP_FILE = "tmp/dog_images.zip"

# Function to apply transformations
def apply_transformations(image, index):
    """Applies different transformations to generate varied images"""
    
    noise = np.random.randint(0, 50, image.shape, dtype=np.uint8)
    noisy_image = cv2.add(image, noise)

    color_shift = np.random.randint(-30, 30, 3)
    color_shifted = np.clip(image + color_shift, 0, 255).astype(np.uint8)

    blurred = cv2.GaussianBlur(image, (5, 5), 0)

    flipped = cv2.flip(image, flipCode=index % 2)

    angle = np.random.randint(-30, 30)
    h, w = image.shape[:2]
    rotation_matrix = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    rotated = cv2.warpAffine(image, rotation_matrix, (w, h))

    transformations = [noisy_image, color_shifted, blurred, flipped, rotated]
    return transformations[index % len(transformations)]

def generate_dog_images(size):
    """Generates 10 modified images from the original dog image."""
    width, height, filter = map(int, size.split("*"))

    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    if not os.path.exists(DOG_IMAGE_PATH):
        print("Error: dog.png not found in public folder!")
        return

    original_image = cv2.imread(DOG_IMAGE_PATH)
    original_image = cv2.resize(original_image, (width, height))

    for i in range(1, 11):
        modified_image = apply_transformations(original_image, i)
        output_path = os.path.join(OUTPUT_FOLDER, f"dog_{i}.png")
        cv2.imwrite(output_path, modified_image)
        print(f"Generated {output_path}")

def create_zip():
    """Zips all generated images into a single ZIP file with correct paths."""
    
    with zipfile.ZipFile(ZIP_FILE, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(OUTPUT_FOLDER):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Fix: Maintain proper relative paths inside ZIP
                zipf.write(file_path, os.path.relpath(file_path, OUTPUT_FOLDER))
    
    print(f"Zipped images at {ZIP_FILE}")

if __name__ == "__main__":
    size = sys.argv[1] if len(sys.argv) > 1 else "100*100"

    generate_dog_images(size)
    create_zip()
