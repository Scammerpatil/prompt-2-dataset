import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { project_description } = await req.json();
    const datasetPath = await generateDataset(project_description);

    console.log("Dataset generated at:", datasetPath);

    // Read the generated CSV file
    const fileBuffer = fs.readFileSync(datasetPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${path.basename(
          datasetPath
        )}"`,
      },
    });
  } catch (error) {
    console.error("Error generating dataset:", error);
    return NextResponse.json(
      { error: "Failed to generate dataset" },
      { status: 500 }
    );
  }
}

const generateDataset = async (project_description: string) => {
  console.log("Generating dataset for:", project_description);

  const pythonScriptPath = "python/generate_dataset.py";
  const command = `python ${pythonScriptPath} "${project_description}"`;

  const { stdout, stderr } = await execAsync(command);

  if (stderr) {
    console.error("Python Script Error:", stderr);
    throw new Error("An error occurred in the Python script.");
  }
  return stdout.trim();
};
