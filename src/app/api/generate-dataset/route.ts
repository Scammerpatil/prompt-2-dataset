import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { writeFileSync } from "fs";
import { parse as json2csv } from "json2csv";
import { Builder } from "xml2js";
import path from "path";
import { faker } from "@faker-js/faker";
import Fuse from "fuse.js";

const extractColumnNames = (responseText: string): string[] => {
  const matches = responseText.match(/\d+\.\s(.*?)(?=\n|$)/g);
  return matches ? matches.map((m) => m.replace(/^\d+\.\s/, "").trim()) : [];
};

const generateDataset = (columns: string[], no_of_rows: number) => {
  // Define generalized column categories
  const columnCategories: Record<string, string[]> = {
    ID: ["id", "patient", "record", "user_id"],
    Name: ["name", "fullname", "patient_name", "person"],
    Email: ["email", "mail", "contact_email"],
    Phone: ["phone", "contact", "mobile", "telephone"],
    Address: ["address", "location", "residence"],
    City: ["city", "town"],
    Country: ["country", "nation"],
    Age: ["age", "years", "patient_age"],
    Date: ["date", "timestamp", "dob", "scan_date"],
    Gender: ["gender", "sex"],
    Price: ["price", "salary", "cost", "amount", "fee"],
    Company: ["company", "organization", "employer"],
    Job: ["job", "title", "occupation"],
    URL: ["url", "website", "link"],
    Boolean: ["boolean", "status", "flag"],
    Medical_Tumor: ["tumor", "tumor_location", "tumor_size", "tumor_type"],
    Medical_Scan: ["scan", "mri", "xray", "radiology", "imaging"],
    Medical_Diagnosis: ["diagnosis", "cancer", "disease"],
    Medical_Treatment: ["treatment", "surgery", "chemo", "therapy"],
    Follow_Up: ["follow_up", "interval", "revisit"],
  };

  // Prepare fuzzy matching with Fuse.js
  const fuse = new Fuse(Object.entries(columnCategories), {
    keys: ["1"],
    threshold: 0.3,
  });

  return Array.from({ length: no_of_rows }, () => {
    const row: Record<string, any> = {};

    columns.forEach((col) => {
      const lowerCol = col.toLowerCase();
      const match = fuse.search(lowerCol)?.[0]?.item?.[0] || "Unknown";

      switch (match) {
        case "ID":
          row[col] = faker.string.uuid();
          break;
        case "Name":
          row[col] = faker.person.fullName();
          break;
        case "Email":
          row[col] = faker.internet.email();
          break;
        case "Phone":
          row[col] = faker.phone.number();
          break;
        case "Address":
          row[col] = faker.location.streetAddress();
          break;
        case "City":
          row[col] = faker.location.city();
          break;
        case "Country":
          row[col] = faker.location.country();
          break;
        case "Age":
          row[col] = faker.number.int({ min: 18, max: 90 });
          break;
        case "Date":
          row[col] = faker.date.past().toISOString().split("T")[0];
          break;
        case "Gender":
          row[col] = faker.helpers.arrayElement(["Male", "Female", "Other"]);
          break;
        case "Price":
          row[col] = faker.finance.amount({ min: 1000, max: 100000, dec: 2 });
          break;
        case "Company":
          row[col] = faker.company.name();
          break;
        case "Job":
          row[col] = faker.person.jobTitle();
          break;
        case "URL":
          row[col] = faker.internet.url();
          break;
        case "Boolean":
          row[col] = faker.datatype.boolean();
          break;
        case "Medical_Tumor":
          row[col] = faker.helpers.arrayElement([
            "Brain",
            "Lung",
            "Breast",
            "Colon",
            "Liver",
            "Kidney",
          ]);
          break;
        case "Medical_Scan":
          row[col] = faker.date.past({ years: 5 }).toISOString().split("T")[0];
          break;
        case "Medical_Diagnosis":
          row[col] = faker.helpers.arrayElement([
            "Benign",
            "Malignant",
            "Stage 1",
            "Stage 2",
            "Stage 3",
            "Stage 4",
          ]);
          break;
        case "Medical_Treatment":
          row[col] = faker.helpers.arrayElement([
            "Surgery",
            "Chemotherapy",
            "Radiotherapy",
            "Immunotherapy",
          ]);
          break;
        case "Follow_Up":
          row[col] = faker.number.int({ min: 3, max: 24 }) + " months";
          break;
        default:
          row[col] = faker.word.noun();
      }
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
