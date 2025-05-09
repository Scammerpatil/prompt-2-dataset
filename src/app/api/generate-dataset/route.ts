import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { writeFileSync } from "fs";
import { parse as json2csv } from "json2csv";
import { Builder } from "xml2js";
import path from "path";
import { faker } from "@faker-js/faker";

const extractColumnsWithTypes = (
  responseText: string
): { name: string; type: string }[] => {
  const matches = responseText.match(/\d+\.\s(.*?)\s-\s(.*?)(?=\n|$)/g);
  return matches
    ? matches
        .map((m) => {
          const [_, name, type] = m.match(/\d+\.\s(.*?)\s-\s(.*)/) || [];
          return { name: name.trim(), type: type.trim().toLowerCase() };
        })
        .filter(({ name }) => name.toLowerCase() !== "target")
    : [];
};

const extractTargetValues = (text: string): string[] => {
  const match = text.match(/Target values:\s*\[(.*?)\]/);
  if (match && match[1]) {
    return match[1].split(",").map((val) => val.trim().replace(/^"|"$/g, ""));
  }
  return [];
};

const generateValueFromFaker = (type: string): any => {
  try {
    switch (type.toLowerCase()) {
      case "uuid":
        return faker.string.uuid();
      case "name":
        return faker.person.fullName();
      case "email":
        return faker.internet.email();
      case "phone":
      case "phonenumber":
        return faker.phone.number();
      case "address":
        return faker.location.streetAddress();
      case "city":
        return faker.location.city();
      case "country":
        return faker.location.country();
      case "number":
      case "age":
        return faker.number.int({ min: 18, max: 90 });
      case "date":
        return faker.date.past().toISOString().split("T")[0];
      case "gender":
        return faker.helpers.arrayElement(["Male", "Female", "Other"]);
      case "jobtitle":
      case "job":
        return faker.person.jobTitle();
      case "price":
      case "salary":
      case "finance.amount":
        return faker.finance.amount({ min: 1000, max: 100000, dec: 2 });
      case "boolean":
        return faker.datatype.boolean();
      case "company":
      case "companysuffix":
        return faker.company.name();
      case "url":
        return faker.internet.url();
      case "text":
        return faker.lorem.sentence();
      case "paragraph":
        return faker.lorem.paragraph();
      case "word":
        return faker.word.noun();
      case "image":
        return faker.image.url();
      case "color":
        return faker.color.rgb();
      case "file":
        return faker.system.filePath();
      case "macaddress":
        return faker.internet.mac();
      case "ipaddress":
        return faker.internet.ip();
      case "currency":
        return faker.finance.currencyCode();
      case "account":
        return faker.finance.accountNumber();
      case "iban":
        return faker.finance.iban();
      case "creditcard":
        return faker.finance.creditCardNumber();
      case "time":
        return faker.date.recent().toISOString();
      case "timezone":
        return faker.date.timeZone();
      case "latitude":
        return faker.location.latitude();
      case "longitude":
        return faker.location.longitude();
      case "region":
        return faker.location.state();
      case "useragent":
        return faker.internet.userAgent();
      case "datetime":
        return faker.date.past();
      case "locale":
        return faker.helpers.arrayElement(["en", "fr", "de", "es"]);
      case "countrycode":
        return faker.location.countryCode();
      case "addresswithpostalcode":
        return `${faker.location.streetAddress()}, ${faker.location.zipCode()}`;
      default:
        return faker.word.noun();
    }
  } catch {
    return faker.word.noun();
  }
};

const generateDataset = (
  columns: { name: string; type: string }[],
  no_of_rows: number,
  targetValues: string[] = []
) => {
  return Array.from({ length: no_of_rows }, () => {
    const row: Record<string, any> = {};

    columns.forEach(({ name, type }) => {
      if (name === "target" && targetValues.length > 0) {
        row[name] = faker.helpers.arrayElement(targetValues);
      } else if (type === "age") {
        row[name] = faker.number.int({ min: 18, max: 90 });
      } else if (type === "gender") {
        row[name] = faker.helpers.arrayElement(["Male", "Female", "Other"]);
      } else {
        row[name] = generateValueFromFaker(type);
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
    const { desc, no_of_rows, no_of_columns, type, goal } = await req.json();

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "user",
          content: `You are an expert in dataset creation. Your job is to suggest ${no_of_columns} structured, domain-relevant column names (excluding the final "Target" column) with accurate data types compatible with Faker.js for high-quality synthetic dataset generation.

          Project Description: ${desc}

          Goal of the Dataset: ${goal}

          Important Instructions:
          1. Return output ONLY in the format: "1. column_name - data_type"
          2. Use **Faker.js-compatible data types** only, such as:
            - name, email, number, date, phone, company, boolean, category
            - finance.amount, jobTitle, address, city, country, internet.url
            - Additional types: uuid, text, paragraph, word, image, color, file, macAddress, ipAddress, currency, account, iban, creditCard, time, timezone, latitude, longitude, region, companySuffix, userAgent, dateTime, phoneNumber, locale, countryCode, addressWithPostalCode, etc.
          3. All column names must be in **snake_case**, meaningful, unique, and aligned with the project context.
          4. Do not repeat similar or redundant data types unless necessary for the domain.
          5. If the dataset involves **prediction**, **classification**, or **detection**, include one final column named **"target"** with type **"category"**.
          6. For the "target" column, provide a sample array of **possible class values** (e.g., ["spam", "not_spam"]).
          7. Return exactly ${
            no_of_columns + 1
          } total columns, including the final "target" column.
          8. Do not include any explanations or commentary — return only the numbered list of column names and their types, followed by the "target" sample values.
          9. Do not include any other text or explanations in the response.
          10. No ** or **bold** text in the response.
          11. We have handled uuid, name, email, phone, phoneNumber, address, city, country, number, age, date, gender, jobTitle, job, price, salary, finance.amount, boolean, company, companySuffix, url, text, paragraph, word, image, color, file, macAddress, ipAddress, currency, account, iban, creditCard, time, timezone, latitude, longitude, region, userAgent, dateTime, locale, countryCode, addressWithPostalCode this many data types, so you can use them in your response.
          12. Please be specific and give only one type for each column.
          13. Do not use any other data types that are not mentioned in the above list.
          14. generate columns only based on the project description and goal and also make sure that the column names are meaningful and relevant to the project description and goal and the number of columns should be exactly ${no_of_columns} and the last column should be target.

          Example Output:
          1. user_id - uuid  
          2. registration_date - date  
          3. user_email - email  
          ...
          ${no_of_columns}. purchase_intent_score - number  
          ${no_of_columns + 1}. target - category  
          Target values: ["interested", "not_interested"] it is a sample array of possible class values for the target column.`,
        },
      ],
    });
    const columnNamesWithTypes = extractColumnsWithTypes(
      response.message.content
    );
    const targetValues = extractTargetValues(response.message.content);
    if (columnNamesWithTypes.length === 0)
      throw new Error("No column names found");

    const dataset = generateDataset(
      columnNamesWithTypes,
      no_of_rows,
      targetValues
    );

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
