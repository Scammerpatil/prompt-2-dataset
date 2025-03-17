import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const ZIP_FILE_PATH = "public/generated_images.zip";

export async function POST(req: NextRequest) {
  try {
    const { size, num_images } = await req.json();
    fs.unlinkSync(ZIP_FILE_PATH);
    const pythonScriptPath = "python/generate_image_dataset.py";
    const command = ` py -3.7 ${pythonScriptPath} ${size} ${num_images}`;
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error("Error executing Python script:", stderr);
    }
    fs.unlinkSync("tmp/generated_images");
    return NextResponse.json({
      message: "Dataset generated successfully",
      path: ZIP_FILE_PATH,
    });
  } catch (error) {
    console.error("Error generating dataset:", error);
    return NextResponse.json(
      { error: "Failed to generate dataset" },
      { status: 500 }
    );
  }
}
