"use client";
import { IconCloudUpload, IconDownload, IconFile } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import Markdown from "react-markdown";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ModelSuggestionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const handleGenerateSuggestion = async () => {
    if (!file) {
      toast.error("Please upload a file.");
      return;
    }
    try {
      const res = axios.postForm("/api/generate-suggestion", { file });
      toast.promise(res, {
        loading: "Generating suggestion...",
        success: (data: AxiosResponse) => {
          setResponse(data.data.suggestion);
          return data.data.suggestion;
        },
        error: "Error generating suggestion. Please try again.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generating suggestion. Please try again.");
    }
  };
  return (
    <>
      <h1 className="text-4xl font-bold text-primary mb-4 text-center uppercase">
        Get Suggestion For training your model
      </h1>
      <div className="px-10 space-y-4">
        <div className="flex items-center justify-center max-w-lg w-full mt-6 mx-auto">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-full border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <IconCloudUpload size={48} className="text-base-content" />
              <p className="mb-2 text-sm text-base-content">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-base-content/70">JSON, CSV, XML</p>
              {file && (
                <p className="badge badge-info mt-2">
                  <IconFile size={16} className="mr-1" /> {file.name}
                </p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="json, csv,xml"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  const file = files[0];
                  if (file.size > 2 * 1024 * 1024) {
                    alert("File size exceeds 2MB limit.");
                  } else {
                    setFile(file);
                  }
                }
              }}
            />
          </label>
        </div>

        <button
          className="btn btn-primary w-full btn-outline"
          onClick={handleGenerateSuggestion}
        >
          Generate Suggestion <IconDownload size={18} />
        </button>
      </div>
      {response && (
        <div className="px-10 space-y-4 mt-6 bg-base-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center uppercase">
            Generated Suggestion
          </h2>
          <div className="prose max-w-full bg-base-100 p-4 rounded-lg shadow-md">
            <Markdown>{response}</Markdown>
          </div>
        </div>
      )}
    </>
  );
}
