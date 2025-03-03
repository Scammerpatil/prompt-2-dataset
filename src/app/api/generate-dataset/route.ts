import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { writeFileSync } from "fs";
import { parse as json2csv } from "json2csv";
import { Builder } from "xml2js";
import path from "path";
import { faker } from "@faker-js/faker";

const extractColumnNames = (responseText: string): string[] => {
  const matches = responseText.match(/\d+\.\s(.*?)(?=\n|$)/g);
  return matches ? matches.map((m) => m.replace(/^\d+\.\s/, "").trim()) : [];
};

const generateDataset = (columns: string[], no_of_rows: number) => {
  return Array.from({ length: no_of_rows }, () => {
    const row: Record<string, any> = {};
    columns.forEach((col) => {
      row[col] = faker.word.noun();
    });
    return row;
  });
};

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
    const { desc, no_of_rows, no_of_columns, type } = await req.json();

    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "user",
          content: `You are an expert in dataset creation. Suggest ${no_of_columns} structured column names for a dataset based on this project: ${desc}. And give just the names of the columns and nothing else consider giving number like 1. 2..`,
        },
      ],
    });

    const columnNames = extractColumnNames(response.message.content);
    if (columnNames.length === 0) throw new Error("No column names found");

    const dataset = generateDataset(columnNames, no_of_rows);

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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate dataset" },
      { status: 500 }
    );
  }
}
