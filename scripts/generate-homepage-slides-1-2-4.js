/**
 * Regenerate homepage hero slides 1, 2 & 4 (16:9 full-bleed) via Grok xAI
 * Saves versioned filenames to bust Next.js / browser image cache.
 * Usage: node scripts/generate-homepage-slides-1-2-4.js
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
  'Sampada Originals premium Indian heritage streetwear, ivory sandalwood cream crimson maroon antique gold palette, cinematic editorial fashion photography, soft claymorphism depth lighting, wide 16:9 hero banner composition, full body model head to toe fully visible no cropping of head or face, generous negative space around subject, no text no logos no watermarks';

const ASSETS = [
  {
    file: '01-winter-drop-v2.jpg',
    prompt: `${BRAND}, winter drop 2026 young Indian woman premium layered crimson gold streetwear jacket and scarf, confident full body pose facing camera, snowy golden hour haveli courtyard background, entire head and face clearly visible above frame center`,
    aspectRatio: '16:9',
  },
  {
    file: '02-wear-your-legacy-v2.jpg',
    prompt: `${BRAND}, three diverse Gen Z Indian friends wearing customized Sampada graphic tees hoodies and coordinated streetwear outfits, playful editorial group pose, matching sandalwood ivory studio backdrop with crimson gold accents, every face and head fully visible uncropped`,
    aspectRatio: '16:9',
  },
  {
    file: '04-prosper-in-style-v2.jpg',
    prompt: `${BRAND}, aspirational young Indian woman prosper in style premium ivory crimson gold apparel, elegant confident full body editorial pose, luxury sandalwood studio, head and face completely visible with space above hair, wide cinematic banner`,
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
  console.log('Regenerating homepage hero slides 1, 2 & 4 (cache-busted v2)...\n');

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