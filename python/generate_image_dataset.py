import os
import sys
import zipfile
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

OUTPUT_FOLDER = "tmp/generated_images"
ZIP_FILE = "public/generated_images.zip"
generator = load_model("python/generator_final.h5")
LATENT_DIM = 100

def generate_images(size, num_images=10):
    """Generates images using the trained GAN model."""
    width, height,channel = map(int, size.split("*"))
    print(f"Generating {num_images} images of size {width}x{height}")
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    for i in range(num_images):
        noise = np.random.normal(0, 1, (1, LATENT_DIM))
        generated_image = generator.predict(noise)
        generated_image = (generated_image * 127.5 + 127.5).astype(np.uint8)
        generated_image = tf.image.resize(generated_image, (height, width)).numpy()
        save_path = os.path.join(OUTPUT_FOLDER, f"generated_{i+1}.png")
        tf.keras.preprocessing.image.save_img(save_path, generated_image[0])
        print(f"Saved: {save_path}")

def create_zip():
    """Zips all generated images into a single ZIP file with correct paths."""
    with zipfile.ZipFile(ZIP_FILE, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(OUTPUT_FOLDER):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, OUTPUT_FOLDER))

    print(f"Zipped images at {ZIP_FILE}")

if __name__ == "__main__":
    size = sys.argv[1] if len(sys.argv) > 1 else "100*100"
    num_images = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    generate_images(size, num_images)
    create_zip()
