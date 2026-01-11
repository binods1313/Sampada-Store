const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Listing available models...");
        // This is a bit of a hack since listModels isn't directly on client in SDK sometimes, 
        // usually we just query one. But let's try to infer from success.
        // Actually the SDK doesn't expose listModels easily in Node.js version directly on the helper class 
        // same as python. We usually just try them.

        const modelsToTry = [
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-pro-vision"
        ];

        for (const modelName of modelsToTry) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log("✅ OK");
            } catch (e) {
                console.log("❌ Failed: " + e.message);
            }
        }

    } catch (e) {
        console.error("Global error:", e);
    }
}

listModels();
