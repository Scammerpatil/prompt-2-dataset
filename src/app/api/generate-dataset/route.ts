import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { writeFileSync } from "fs";
import { parse as json2csv } from "json2csv";
import { Builder } from "xml2js";
import path from "path";
import { faker } from "@faker-js/faker";
import Fuse from "fuse.js";

const extractColumnsWithTypes = (
  responseText: string
): { name: string; type: string }[] => {
  const matches = responseText.match(/\d+\.\s(.*?)\s-\s(.*?)(?=\n|$)/g);
  return matches
    ? matches.map((m) => {
        const [_, name, type] = m.match(/\d+\.\s(.*?)\s-\s(.*)/) || [];
        return { name: name.trim(), type: type.trim().toLowerCase() };
      })
    : [];
};

const generateDataset = (
  columns: { name: string; type: string }[],
  no_of_rows: number
) => {
  return Array.from({ length: no_of_rows }, () => {
    const row: Record<string, any> = {};

    columns.forEach(({ name, type }) => {
      switch (type) {
        case "uuid":
          row[name] = faker.string.uuid();
          break;
        case "name":
          row[name] = faker.person.fullName();
          break;
        case "email":
          row[name] = faker.internet.email();
          break;
        case "phone":
          row[name] = faker.phone.number();
          break;
        case "address":
          row[name] = faker.location.streetAddress();
          break;
        case "city":
          row[name] = faker.location.city();
          break;
        case "country":
          row[name] = faker.location.country();
          break;
        case "number":
        case "age":
          row[name] = faker.number.int({ min: 18, max: 90 });
          break;
        case "date":
          row[name] = faker.date.past().toISOString().split("T")[0];
          break;
        case "gender":
          row[name] = faker.helpers.arrayElement(["Male", "Female", "Other"]);
          break;
        case "jobTitle":
          row[name] = faker.person.jobTitle();
          break;
        case "price":
        case "salary":
        case "finance.amount":
          row[name] = faker.finance.amount({ min: 1000, max: 100000, dec: 2 });
          break;
        case "boolean":
          row[name] = faker.datatype.boolean();
          break;
        case "company":
          row[name] = faker.company.name();
          break;
        case "job":
          row[name] = faker.person.jobTitle();
          break;
        case "url":
          row[name] = faker.internet.url();
          break;
        case "text":
          row[name] = faker.lorem.sentence();
          break;
        case "paragraph":
          row[name] = faker.lorem.paragraph();
          break;
        case "word":
          row[name] = faker.word.noun();
          break;
        case "image":
          row[name] = faker.image.url();
          break;
        case "color":
          row[name] = faker.color.rgb();
          break;
        case "file":
          row[name] = faker.system.filePath();
          break;
        case "macAddress":
          row[name] = faker.internet.mac();
          break;
        case "ipAddress":
          row[name] = faker.internet.ip();
          break;
        case "currency":
          row[name] = faker.finance.currencyCode();
          break;
        case "account":
          row[name] = faker.finance.account();
          break;
        case "iban":
          row[name] = faker.finance.iban();
          break;
        case "creditCard":
          row[name] = faker.finance.creditCardNumber();
          break;
        case "time":
          row[name] = faker.time.recent();
          break;
        case "timezone":
          row[name] = faker.time.timezone();
          break;
        case "latitude":
          row[name] = faker.location.latitude();
          break;
        case "longitude":
          row[name] = faker.location.longitude();
          break;
        case "region":
          row[name] = faker.location.region();
          break;
        case "companySuffix":
          row[name] = faker.company.suffix();
          break;
        case "userAgent":
          row[name] = faker.internet.userAgent();
          break;
        case "dateTime":
          row[name] = faker.date.past();
          break;
        case "phoneNumber":
          row[name] = faker.phone.number();
          break;
        case "locale":
          row[name] = faker.locale;
          break;
        case "countryCode":
          row[name] = faker.address.countryCode();
          break;
        case "addressWithPostalCode":
          row[name] =
            faker.location.streetAddress() + ", " + faker.location.zipCode();
          break;
        default:
          row[name] = faker.word.noun();
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
          content: `You are an expert in dataset creation. Suggest ${no_of_columns} structured column names with data types for Faker.js data generation. Make sure the data types align with Faker.js functions (e.g., "1. Name - name", "2. Email - email", "3. Age - number", "4. Date of Birth - date", "5. Phone - phone", "6. Company - company").  The response should only contain numbered column names with their corresponding data types, nothing else.  For categorical values, use "category".  For true/false values, use "boolean".  For IDs, use "uuid".  For monetary values, use "finance.amount".  For job-related values, use "jobTitle".  For location-based values, use "city", "country", or "address".  For medical-related fields, use "medical_tumor", "medical_diagnosis", "medical_scan".For URLs, use "internet.url".For any other data types, use "word.noun".If you are unsure about a data type, use "word.noun".for project: ${desc}`,
        },
      ],
    });
    console.log("Response:", response);

    const columnNamesWithTypes = extractColumnsWithTypes(
      response.message.content
    );
    if (columnNamesWithTypes.length === 0)
      throw new Error("No column names found");

    const dataset = generateDataset(columnNamesWithTypes, no_of_rows);

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
