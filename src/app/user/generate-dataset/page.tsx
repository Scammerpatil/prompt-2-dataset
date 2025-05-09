"use client";
import React, { useState } from "react";
import { IconDatabase, IconDownload } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

const GenerateDatasetPage = () => {
  const [prompt, setPrompt] = useState({
    desc: "",
    goal: "",
    no_of_rows: 0,
    no_of_columns: 0,
    type: "",
  });

  const handleGenerate = async () => {
    if (!prompt.desc.trim()) {
      toast.error("Please enter a project description.");
      return;
    }

    try {
      const response = axios.post("/api/generate-dataset", prompt, {
        responseType: "blob",
      });

      toast.promise(response, {
        loading: "Generating dataset...",
        success: (data: AxiosResponse) => {
          const url = window.URL.createObjectURL(new Blob([data.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = `generated_dataset.${prompt.type}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
        error: "Error generating dataset. Please try again.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generating dataset. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-primary mb-4 text-center uppercase">
        Generate Dataset
      </h1>
      <div className="px-10 space-y-4">
        <label htmlFor="desc" className="form-control w-full">
          <div className="label">
            <span className="text-base">Describe your project</span>
          </div>
          <input
            className="input input-bordered w-full text-base"
            name="desc"
            placeholder="Describe your project... (e.g., 'Detect brain stroke')"
            value={prompt.desc}
            onChange={(e) => setPrompt({ ...prompt, desc: e.target.value })}
          />
        </label>

        <label htmlFor="desc" className="form-control w-full">
          <div className="label">
            <span className="text-base">Describe your project goal</span>
          </div>
          <input
            className="input input-bordered w-full text-base"
            placeholder="Describe your project goal... (e.g., 'Generate a dataset for brain stroke detection')"
            value={prompt.goal}
            onChange={(e) => setPrompt({ ...prompt, goal: e.target.value })}
          />
        </label>

        <label htmlFor="desc" className="form-control w-full">
          <div className="label">
            <span className="text-base">How many coloumns you need??</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full text-base"
            placeholder="Number of columns"
            value={prompt.no_of_columns}
            min={10}
            onChange={(e) => {
              setPrompt({ ...prompt, no_of_columns: parseInt(e.target.value) });
            }}
          />
        </label>

        <label htmlFor="desc" className="form-control w-full">
          <div className="label">
            <span className="text-base">How many rows you want??</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full text-base"
            placeholder="Number of rows"
            value={prompt.no_of_rows}
            min={100}
            onChange={(e) => {
              setPrompt({ ...prompt, no_of_rows: parseInt(e.target.value) });
            }}
          />
        </label>

        <label htmlFor="desc" className="form-control w-full">
          <div className="label">
            <span className="text-base">What Format You prefer?</span>
          </div>
          <select
            className="select select-bordered w-full text-base"
            value={prompt.type}
            onChange={(e) => {
              setPrompt({ ...prompt, type: e.target.value });
            }}
          >
            <option value="">Select Format</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
          </select>
        </label>

        <button
          className="btn btn-primary w-full btn-outline"
          onClick={handleGenerate}
        >
          Generate Dataset <IconDownload size={18} />
        </button>
      </div>
    </>
  );
};

export default GenerateDatasetPage;
