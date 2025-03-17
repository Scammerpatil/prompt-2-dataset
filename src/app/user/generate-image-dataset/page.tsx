"use client";
import React, { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const GenerateDatasetPage = () => {
  const [path, setPath] = useState("");
  const [prompt, setPrompt] = useState({
    image: "Brain MRI",
    size: "128*128*3",
    num_images: 10,
  });

  const handleGenerate = async () => {
    try {
      const responsePromise = axios.post("/api/generate-image-dataset", prompt);

      await toast.promise(responsePromise, {
        loading: "Generating dataset...",
        success: async (data: AxiosResponse) => {
          setPath(data.data.path);
          return "Dataset generated successfully";
        },
        error: "Error generating dataset. Please try again.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generating dataset. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold text-primary mb-4 text-center uppercase">
        Generate Image Dataset
      </h1>
      <div className="px-10 space-y-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="text-base">
              Since We can only provide brain images, please select the image
              type
            </span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full text-base"
            value={prompt.image}
            readOnly
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="text-base">What size images do you want?</span>
          </div>
          <select
            className="select select-bordered w-full text-base"
            value={prompt.size}
            onChange={(e) => setPrompt({ ...prompt, size: e.target.value })}
          >
            <option value="">Select size</option>
            <option value="32*32*3">32 X 32 X 3</option>
            <option value="64*64*3">64 X 64 X 3</option>
            <option value="128*128*3">128 X 128 X 3</option>
            <option value="256*256*3">256 X 256 X 3</option>
            <option value="512*512*3">512 X 512 X 3</option>
            <option value="1024*1024*3">1024 X 1024 X 3</option>
          </select>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="text-base">What number of images you want?</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full text-base"
            value={prompt.num_images}
            onChange={(e) =>
              setPrompt({ ...prompt, num_images: parseInt(e.target.value) })
            }
          />
        </label>
        <button
          className="btn btn-primary w-full btn-outline"
          onClick={handleGenerate}
        >
          Generate Images <IconDownload size={18} />
        </button>
        {path && (
          <a
            href="/generated_images.zip"
            className="btn btn-secondary w-full btn-outline"
            download="generated_images.zip"
          >
            Download Dataset <IconDownload size={18} />
          </a>
        )}
      </div>
    </div>
  );
};

export default GenerateDatasetPage;
