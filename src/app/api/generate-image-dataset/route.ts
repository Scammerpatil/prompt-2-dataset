import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

const ZIP_FILE_PATH = "tmp/dog_images.zip";

export async function POST(req: NextRequest) {
  try {
    const { size } = await req.json();

    const pythonScriptPath = "python/generate_image_dataset.py";
    const command = ` py -3.12 ${pythonScriptPath} ${size} `;
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error("Error executing Python script:", stderr);
    }
    if (!fs.existsSync(ZIP_FILE_PATH)) {
      return NextResponse.json(
        { error: "ZIP file not found" },
        { status: 500 }
      );
    }
    const zipData = fs.readFileSync(ZIP_FILE_PATH);

    return NextResponse.json(zipData, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=dog_images.zip",
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
