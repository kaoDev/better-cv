import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { type Item, PdfReader } from "pdfreader";
import { z } from "zod";
import {
  contactDetailSchema,
  educationSchema,
  languageSchema,
  referenceSchema,
} from "../personal-details/helpers";
import { workExperienceClientFormSchema } from "../work-experience/types";

async function parsePdf(pdfFileBuffer: Buffer) {
  let documentText = "";

  let rows: Record<number, string[]> = {}; // indexed by y-position

  function addPageSeparator(pageNumber: number) {
    documentText += `\n  -- PAGE ${pageNumber} -- \n`;
  }
  function printRow(y: number) {
    documentText += (rows[y] ?? []).join("") + "\n";
  }

  function printRows() {
    Object.keys(rows) // => array of y-positions (type: float)
      .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
      .forEach((y) => printRow(parseFloat(y)));
  }

  return new Promise<string>((resolve, reject) => {
    new PdfReader().parseBuffer(pdfFileBuffer, function (err, item) {
      if (err) {
        reject(new Error(err));
        return;
      }
      if (!item) {
        // end of file
        printRows();
        resolve(documentText);
        return;
      } else if (item.page) {
        // end of file, or page
        printRows();
        addPageSeparator(item.page);
        rows = {}; // clear rows for next page
      } else if (item.text) {
        const textItem = item as Item;

        // accumulate text items into rows object, per line
        (rows[textItem.y] = rows[textItem.y] ?? []).push(textItem.text);
      }
    });
  });
}

const pdfResultSchema = z.object({
  workExperiences: z.array(workExperienceClientFormSchema),
  contactDetails: z.array(contactDetailSchema),
  educations: z.array(educationSchema),
  languages: z.array(languageSchema),
  references: z.array(referenceSchema),
});

export async function parseInformationFromPDf(pdfFileBuffer: Buffer) {
  console.log("start parsing pdf");
  const pdfContent = await parsePdf(pdfFileBuffer);

  console.log("generate structured data from pdf content");
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    output: "object",
    schema: pdfResultSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `extract information from the given text to collect useful information about work experiences, contact details, educations, languages, and references`,
          },
          {
            type: "text",
            text: pdfContent,
          },
        ],
      },
    ],
  });

  return object;
}
