/**
 * Regenerate Stories hero slide 5 — legacy portrait (16:9 full-bleed)
 * Usage: node scripts/generate-stories-slide5.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'stories', 'hero');
const OUT_FILE = 'slide5.png';

const PROMPT =
  'Sampada Originals premium Indian heritage fashion editorial photograph, ivory sandalwood cream crimson maroon antique gold palette, soft claymorphism depth lighting, young elegant Indian woman wearing ivory cream silk saree with rich crimson red and gold zari border, gold jhumka earrings, dignified poised full body pose head to toe fully visible no cropping, standing in grand palace temple interior with carved stone pillars and warm golden hour light, wide cinematic 16:9 hero banner composition with generous breathing room around model, cinematic luxury lookbook, no text no logos no watermarks';

async function main() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('XAI_API_KEY is not set');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating Stories hero slide 5 (16:9 full-bleed)...\n');

  const response = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-imagine-image',
      prompt: PROMPT,
      n: 1,
      response_format: 'url',
      aspect_ratio: '16:9',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}`);
  }

  const imageUrl = data?.data?.[0]?.url;
  if (!imageUrl) throw new Error('No image URL returned');

  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error('Failed to download image');

  const buffer = Buffer.from(await imageRes.arrayBuffer());
  const outPath = path.join(OUT_DIR, OUT_FILE);

  await sharp(buffer).png({ compressionLevel: 8 }).toFile(outPath);

  const stats = fs.statSync(outPath);
  console.log(`✓ Saved ${OUT_FILE} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});