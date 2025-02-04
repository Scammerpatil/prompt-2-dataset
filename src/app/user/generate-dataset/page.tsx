"use client";
import React, { useState } from "react";
import { IconDatabase, IconDownload } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";

const GenerateDatasetPage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a project description.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/generate-dataset",
        {
          project_description: prompt,
        },
        {
          responseType: "blob", // Expecting a file (CSV)
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated_dataset.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Dataset downloaded successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generating dataset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
        <IconDatabase size={24} /> Generate Dataset
      </h1>

      <textarea
        className="textarea textarea-bordered w-full max-w-lg text-base"
        placeholder="Describe your project... (e.g., 'Detect brain stroke')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      <button
        className={`btn btn-primary ${loading ? "loading" : ""}`}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Dataset"}
      </button>
    </div>
  );
};

export default GenerateDatasetPage;
