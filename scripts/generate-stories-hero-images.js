/**
 * Generate full-bleed Stories hero banners (16:9) via Grok xAI
 * Palette: ivory · sandalwood · crimson · gold
 * Usage: node scripts/generate-stories-hero-images.js
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

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'stories', 'hero');

const BRAND =
  'Sampada Originals premium Indian heritage fashion, ivory sandalwood cream crimson maroon antique gold palette, cinematic editorial photography, full body model centered in wide banner frame, soft claymorphism depth lighting, no text no logos no watermarks';

const ASSETS = [
  {
    file: '01-winter-editorial.jpg',
    prompt: `${BRAND}, young Indian woman winter layered crimson gold streetwear, snowy haveli courtyard golden hour, wide cinematic hero banner composition with breathing room on sides`,
    aspectRatio: '16:9',
    objectPosition: 'center center',
  },
  {
    file: '02-festive-silk-look.jpg',
    prompt: `${BRAND}, festive silk contemporary outfit rich crimson gold drape, elegant full body pose, warm sandalwood ivory studio, wide lookbook banner`,
    aspectRatio: '16:9',
    objectPosition: 'center 30%',
  },
  {
    file: '03-premium-casual.jpg',
    prompt: `${BRAND}, premium casual ivory kurta crimson accents layered apparel, confident stance, Bengaluru luxury editorial, wide full-bleed banner`,
    aspectRatio: '16:9',
    objectPosition: 'center center',
  },
  {
    file: '04-gold-embroidered.jpg',
    prompt: `${BRAND}, gold zari embroidered heritage jacket full body model, intricate detail, cinematic crimson gold lighting, wide magazine cover banner`,
    aspectRatio: '16:9',
    objectPosition: 'center 25%',
  },
  {
    file: 'slide5.png',
    prompt: `${BRAND}, ivory cream silk saree crimson gold zari border, dignified full body pose head to toe visible, grand palace pillars golden hour, legacy portrait wide hero banner`,
    aspectRatio: '16:9',
    objectPosition: 'center 35%',
  },
  {
    file: '06-evening-gala.jpg',
    prompt: `${BRAND}, evening gala couture crimson gown gold jewelry, full body classy pose, ivory sandal spotlight backdrop, wide cinematic banner`,
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
  fs.writeFileSync(path.join(OUT_DIR, asset.file), buffer);
  console.log(`✓ Saved ${asset.file} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${ASSETS.length} full-bleed Stories hero banners (16:9)...\n`);

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