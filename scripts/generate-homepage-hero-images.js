/**
 * Generate 6 Sampada Originals homepage hero banners via Grok xAI
 * Palette: ivory #FDF6EC, sandalwood #F5ECD7, crimson #8B1A1A, gold #C9A84C
 * Usage: node scripts/generate-homepage-hero-images.js
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
  'Sampada Originals luxury Indian heritage streetwear, ivory sandalwood cream crimson maroon antique gold palette, editorial fashion photography, warm cinematic lighting, no text no logos no watermarks';

const ASSETS = [
  {
    file: '01-winter-drop.jpg',
    prompt: `${BRAND}, winter drop 2026 young Indian woman premium layered crimson gold streetwear, full body head fully visible no cropping, snowy golden hour editorial, wide hero banner`,
    aspectRatio: '16:9',
  },
  {
    file: '02-wear-your-legacy.jpg',
    prompt: `${BRAND}, Gen Z Indian models customized Sampada graphic outfits, matching sandalwood ivory crimson gold studio backdrop, all heads bodies visible, editorial lookbook`,
    aspectRatio: '16:9',
  },
  {
    file: '03-gold-thread.jpg',
    prompt: `${BRAND}, macro gold thread embroidery on crimson fabric, intricate kantha zari detail, luxury textile close-up editorial`,
    aspectRatio: '16:9',
  },
  {
    file: '04-prosper-in-style.jpg',
    prompt: `${BRAND}, aspirational prosperity lifestyle, elegant premium apparel in sandalwood ivory studio, confident editorial fashion`,
    aspectRatio: '16:9',
  },
  {
    file: '05-generational-wealth.jpg',
    prompt: `${BRAND}, generational wealth symbolism, gold accents on deep crimson, heirloom quality fabrics, powerful editorial still life`,
    aspectRatio: '16:9',
  },
  {
    file: '06-sampada-originals.jpg',
    prompt: `${BRAND}, abstract lotus mandala with gold geometric patterns on ivory background, brand emblem atmosphere, hero banner art`,
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
  console.log(`Generating ${ASSETS.length} homepage hero banners...\n`);

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