// backend/scripts/find-working-model.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyCSEqJH3PGwDmhQ6XMeqLBPbDooYRN5S48";

async function findWorkingModel() {
  console.log("🔍 Finding working Gemini model...\n");

  if (!API_KEY) {
    console.error("❌ No API key found");
    return;
  }

  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...\n`);

  const genAI = new GoogleGenerativeAI(API_KEY);

  // List ALL possible model names
  const allModels = [
    // Standard models
    "gemini-pro",
    "models/gemini-pro",

    // Version 1.0
    "gemini-1.0-pro",
    "models/gemini-1.0-pro",
    "gemini-1.0-pro-001",

    // Version 1.5 (might not be available in all regions)
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "models/gemini-1.5-pro",

    // Flash models
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "models/gemini-1.5-flash",

    // Vision models
    "gemini-pro-vision",
    "models/gemini-pro-vision",

    // Try with different API versions
    "gemini-pro:v1",
    "gemini-pro:latest",
  ];

  console.log(`Testing ${allModels.length} models...\n`);

  for (const modelName of allModels) {
    try {
      console.log(`🔄 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      // Quick test
      const result = await model.generateContent("Hello");
      const response = await result.response;
      const text = response.text();

      console.log(`   ✅ SUCCESS! Response: "${text}"`);
      console.log(`\n🎯 RECOMMENDATION: Use this in your gemini.service.ts:`);
      console.log(
        `   this.model = this.genAI.getGenerativeModel({ model: "${modelName}" });\n`
      );

      return modelName;
    } catch (error: any) {
      const errorMsg = error.message;
      console.log(`   ❌ Failed: ${errorMsg.substring(0, 80)}...`);
    }
  }

  console.log("\n❌ No models worked. Possible issues:");
  console.log("1. Your API key might be invalid or expired");
  console.log("2. You might be in a region without Gemini access");
  console.log(
    "3. Try creating a new API key at: https://makersuite.google.com/app/apikey"
  );
  console.log("\n💡 Alternative: Use a mock service for now");

  return null;
}

findWorkingModel().catch(console.error);
