import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { writeFileSync } from "fs";
import { parse as json2csv } from "json2csv";
import { Builder } from "xml2js";
import path from "path";

const formatDataset = (data: any[], type: string) => {
  if (type === "csv") {
    return json2csv(data);
  } else if (type === "json") {
    return JSON.stringify(data, null, 2);
  } else if (type === "xml") {
    const builder = new Builder();
    return builder.buildObject({ dataset: { record: data } });
  }
  throw new Error("Invalid format type");
};

export async function POST(req: NextRequest) {
  try {
    const { desc, no_of_rows, no_of_columns, type, goal } = await req.json();

    // Prompt with strict JSON-only instructions
    const prompt = `You are an expert in dataset creation. Generate a high-quality synthetic dataset for the following project.

Project Description: ${desc}
Goal of the Dataset: ${goal}
Number of Columns (excluding Target): ${no_of_columns - 1}
Number of Rows: ${no_of_rows}

Instructions:
- First Think, then Act.
- Output only a JSON array of ${no_of_rows} objects and it should be used in JSON.parse() so the json data should be javascript friendly.
- Each object must contain ${
      no_of_columns - 1
    } structured fields relevant to the project.
- Include a final field named "Target" as the last key in each object.
- "Target" must be a string (max 50 characters) that aligns with the goal.
- Do not include any explanations, comments, markdown formatting, or extra text—only raw JSON.
- Ensure data types are realistic and fields are semantically consistent with the project domain.
`;

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response.message.content.trim();

    let jsonStart = rawContent.indexOf("[");
    let jsonEnd = rawContent.lastIndexOf("]") + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid JSON format returned by model.");
    }

    const jsonString = rawContent.substring(jsonStart, jsonEnd);
    const dataset = JSON.parse(jsonString);

    const formattedData = formatDataset(dataset, type);
    const filePath = path.join("./tmp", `dataset.${type}`);
    writeFileSync(filePath, formattedData);

    const fileBuffer = Buffer.from(formattedData, "utf-8");

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": `text/${type}`,
        "Content-Disposition": `attachment; filename="dataset.${type}"`,
      },
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate dataset", detail: error.message },
      { status: 500 }
    );
  }
}
