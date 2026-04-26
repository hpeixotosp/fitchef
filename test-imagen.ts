import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
  console.log("Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 5));
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  try {
    const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
    const res = await model.generateContent("a delicious lasagna");
    console.log("Success:", Object.keys(res.response));
    console.log("Candidates:", res.response.candidates?.length);
    if (res.response.candidates && res.response.candidates.length > 0) {
      const part = res.response.candidates[0].content.parts[0];
      if (part.inlineData) {
        console.log("MimeType:", part.inlineData.mimeType);
      } else {
        console.log("No inline data");
      }
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
