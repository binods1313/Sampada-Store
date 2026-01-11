/**
 * Verification script to check for common API key issues
 */
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.log("STATUS: MISSING - GEMINI_API_KEY not found.");
} else {
    console.log("STATUS: FOUND");
    console.log("LENGTH: " + key.length);
    console.log("PREFIX: " + key.substring(0, 3) + "...");
    console.log("SUFFIX: ..." + key.substring(key.length - 3));

    if (key.includes('"') || key.includes("'")) {
        console.log("WARNING: Key contains quotes. These should be removed from the .env file.");
    }
    if (key.trim().length !== key.length) {
        console.log("WARNING: Key contains whitespace at the beginning or end.");
    }
}
