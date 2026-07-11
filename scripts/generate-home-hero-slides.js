/**
 * Generate homepage hero slides 1, 2 & 4 → public/images/home/hero/*.png
 * Usage: node scripts/generate-home-hero-slides.js
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

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'home', 'hero');

const BRAND =
  'Sampada Originals premium Indian heritage fashion, ivory sandalwood cream crimson maroon antique gold palette, cinematic editorial photography, soft claymorphism depth lighting, wide 16:9 full-bleed hero banner composition, full body model head to toe fully visible no cropping of head face or body, generous breathing room around subject, no text no logos no watermarks';

const ASSETS = [
  {
    file: 'slide1.png',
    prompt: `${BRAND}, winter drop 2026 young Indian woman premium layered crimson gold streetwear, confident full body pose facing camera, snowy golden hour haveli courtyard, entire head clearly visible with space above`,
    aspectRatio: '16:9',
    objectPosition: 'center 22%',
  },
  {
    file: 'slide2.png',
    prompt: `${BRAND}, three diverse Gen Z Indian friends wearing customized Sampada graphic tees hoodies coordinated streetwear, playful editorial group pose, matching sandalwood ivory studio backdrop crimson gold accents, every face head and body fully visible uncropped`,
    aspectRatio: '16:9',
    objectPosition: 'center 30%',
  },
  {
    file: 'slide4.png',
    prompt: `${BRAND}, prosper in style elegant young Indian woman classy ivory crimson gold couture outfit, refined full body editorial pose, luxurious palace interior soft golden light, head and face completely visible no cropping, wide cinematic banner`,
    aspectRatio: '16:9',
    objectPosition: 'center 20%',
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
  const outPath = path.join(OUT_DIR, asset.file);
  await sharp(buffer).png({ compressionLevel: 8 }).toFile(outPath);

  const stats = fs.statSync(outPath);
  console.log(`✓ Saved ${asset.file} (${(stats.size / 1024).toFixed(1)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('Generating homepage hero slides 1, 2 & 4 → public/images/home/hero/\n');

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