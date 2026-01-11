/**
 * Verification script for .env.local
 */
require('dotenv').config({ path: '.env.local' });

const key = process.env.GEMINI_API_KEY;

console.log("Checking .env.local GEMINI_API_KEY...");

if (!key) {
    console.log("STATUS: MISSING - GEMINI_API_KEY not found in .env.local");
} else {
    console.log("STATUS: FOUND");
    console.log("LENGTH: " + key.length);
    console.log("PREFIX: " + key.substring(0, 3) + "...");
    console.log("SUFFIX: ..." + key.substring(key.length - 3));

    // Check validity of characters (base64ish)
    if (!/^[a-zA-Z0-9_\-]+$/.test(key)) {
        console.log("WARNING: Key contains invalid characters (maybe quotes or spaces?)");
    }
}
