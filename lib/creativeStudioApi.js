// lib/creativeStudioApi.js

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop', // Cyberpunk
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop', // Neon Abstract
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Portrait
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'  // Abstract Paint
];

/**
 * Mocks the image generation flow. In the future, this can be swapped
 * with Google Gemini or Adobe Firefly APIs which are already dependencies in this project.
 * 
 * @param {string} prompt The text prompt to generate images from.
 * @param {string} modelId The selected model's ID (e.g. 'imagen-3').
 * @returns {Promise<string[]>} A promise resolving to an array of generated image URLs.
 */
export async function generateImage(prompt, modelId = 'imagen-3') {
  // Ensure a minimum delay of 3 seconds to show the premium loading animation
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  if (!prompt) {
    throw new Error("Prompt is required for image generation.");
  }
  
  // Shuffled mock images to simulate variety on each generation
  return [...MOCK_IMAGES].sort(() => 0.5 - Math.random());
}
