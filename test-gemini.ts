import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
  console.log("Testing Gemini API key...");
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  console.log("Key starts with:", apiKey.substring(0, 5));
  console.log("Key length:", apiKey.length);
  
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is empty");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Test with the same model used in the application
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const res = await model.generateContent("Say hello in Portuguese");
    console.log("Success! Response:", res.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();