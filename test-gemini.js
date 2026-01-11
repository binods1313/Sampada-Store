/**
 * Test script to verify Gemini API key is working
 * Run with: node test-gemini.js
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    console.log("Testing Gemini API connection...\n");

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ ERROR: GEMINI_API_KEY not found in environment variables!");
        console.log("Make sure it's set in your .env or .env.local file");
        return;
    }

    console.log("✓ GEMINI_API_KEY found");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        console.log("✓ Gemini client initialized");
        console.log("→ Sending test request...\n");

        const result = await model.generateContent("Say 'Hello from Sampada!' in a creative way with an emoji.");
        const response = await result.response;
        const text = response.text();

        console.log("═══════════════════════════════════════");
        console.log("✅ GEMINI API IS WORKING!");
        console.log("═══════════════════════════════════════");
        console.log("\nResponse:", text);
        console.log("\n✓ Your Gemini API key is valid and working!");

    } catch (error) {
        console.error("═══════════════════════════════════════");
        console.error("❌ GEMINI API ERROR");
        console.error("═══════════════════════════════════════");
        console.error("\nError:", error.message);

        if (error.message.includes("404") || error.message.includes("not found")) {
            console.log("\n→ Model not found. Ensure 'Generative Language API' is enabled in Google Cloud Console.");
            console.log("  And that your API Key has access to it.");
        }
    }
}

testGemini();
