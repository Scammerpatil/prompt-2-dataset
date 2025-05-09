import ollama from "ollama";
import { NextRequest, NextResponse } from "next/server";
import { parse as parseCSV } from "csv-parse/sync";
import xml2js from "xml2js";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ message: "File not found" }, { status: 400 });
  }
  try {
    // Identifying the file type
    const fileType = file.type;
    if (
      fileType !== "application/json" &&
      fileType !== "text/csv" &&
      fileType !== "application/xml"
    ) {
      return NextResponse.json(
        { message: "Invalid file type" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString("utf-8");

    let parsed: any[] = [];

    if (fileType === "application/json") {
      const json = JSON.parse(content);
      parsed = Array.isArray(json) ? json.slice(0, 10) : [json];
    } else if (fileType === "text/csv") {
      parsed = parseCSV(content, {
        columns: true,
        skip_empty_lines: true,
      }).slice(0, 10);
    } else if (fileType === "application/xml" || file.name.endsWith(".xml")) {
      const xml = await xml2js.parseStringPromise(content, {
        explicitArray: false,
      });
      const values = Object.values(xml)[0];
      parsed = Array.isArray(values) ? values.slice(0, 10) : [values];
    } else {
      return NextResponse.json(
        { message: "Invalid file type" },
        { status: 400 }
      );
    }
    console.log("Parsed Data:", parsed);
    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "user",
          content: `Based on the following data, suggest a model architecture and training parameters for a machine learning model like DecisionTreeClassifier, LogisticRegression, etc.. Data: $\n\n${JSON.stringify(
            parsed,
            null,
            2
          )}`,
        },
      ],
    });
    return NextResponse.json(
      { suggestion: response.message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error generating suggestion" },
      { status: 500 }
    );
  }
}
