/**
 * Regenerate homepage hero slides 1 & 2 (16:9 full-bleed) via Grok xAI
 * Usage: node scripts/generate-homepage-slides-1-2.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'homepage', 'hero');

const BRAND =
  'Sampada Originals premium Indian heritage streetwear, ivory sandalwood cream crimson maroon antique gold palette, cinematic editorial fashion photography, soft claymorphism depth lighting, wide 16:9 hero banner composition, full body model head to toe fully visible no cropping, no text no logos no watermarks';

const ASSETS = [
  {
    file: '01-winter-drop.jpg',
    prompt: `${BRAND}, winter drop 2026 young Indian woman premium layered crimson gold streetwear, confident pose, snowy golden hour haveli courtyard, model centered with generous breathing room, head fully visible`,
    aspectRatio: '16:9',
  },
  {
    file: '02-wear-your-legacy.jpg',
    prompt: `${BRAND}, diverse Gen Z Indian models group wearing customized Sampada graphic tees and coordinated outfits, vibrant yet premium styling, matching sandalwood ivory studio backdrop with crimson gold accents, energetic editorial lookbook, all heads and bodies fully visible`,
    aspectRatio: '16:9',
  },
];

async function generateImage(asset) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('XAI_API_KEY is not set');

  const response = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-imagine-image',
      prompt: asset.prompt,
      n: 1,
      response_format: 'url',
      aspect_ratio: asset.aspectRatio,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}`);
  }

  const imageUrl = data?.data?.[0]?.url;
  if (!imageUrl) throw new Error(`No image URL for ${asset.file}`);

  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error(`Failed to download ${asset.file}`);

  const buffer = Buffer.from(await imageRes.arrayBuffer());
  fs.writeFileSync(path.join(OUT_DIR, asset.file), buffer);
  console.log(`✓ Saved ${asset.file} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('Regenerating homepage hero slides 1 & 2 (16:9 full-bleed)...\n');

  for (const asset of ASSETS) {
    try {
      await generateImage(asset);
    } catch (err) {
      console.error(`✗ ${asset.file}: ${err.message}`);
    }
  }

  console.log('\nDone.');
}

main();