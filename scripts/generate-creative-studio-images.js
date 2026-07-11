/**
 * Generate Creative Studio card images via Grok xAI and save to public/images/creative-studio/
 * Usage: node scripts/generate-creative-studio-images.js
 */

const fs = require('fs');
const path = require('path');

// Load .env manually (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'creative-studio');

const ASSETS = [
  {
    file: 'start-new-design.jpg',
    prompt:
      'Luxury Indian creative design studio desk, blank canvas and gold design tools, deep crimson and antique gold color palette, warm cinematic lighting, premium editorial photography, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'upload.jpg',
    prompt:
      'Elegant file upload concept, floating documents and images over dark mahogany surface, gold accents, Indian luxury brand aesthetic, soft spotlight, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'edit-photos.jpg',
    prompt:
      'Professional photo editing workspace, color grading on fashion portrait, crimson and gold studio tones, premium creative software mood, no text no logos',
    aspectRatio: '4:3',
  },
  {
    file: 'create-video.jpg',
    prompt:
      'Cinematic video production scene, camera on tripod filming golden hour fashion scene, deep burgundy and gold atmosphere, dramatic lighting, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'generate-with-ai.jpg',
    prompt:
      'Abstract AI art generation visualization, luminous neural patterns forming a lotus and fabric textures, crimson gold and cream palette, futuristic yet heritage Indian luxury, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'text-to-image.jpg',
    prompt:
      'Text transforming into vivid painted imagery, magical particles, Indian heritage motifs emerging from light, crimson and antique gold, editorial art direction, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'generative-fill.jpg',
    prompt:
      'Digital brush painting new elements into a photograph, inpainting concept, lush fabric and jewelry details, warm gold lighting on dark background, no text',
    aspectRatio: '4:3',
  },
  {
    file: 'text-effects.jpg',
    prompt:
      'Ornate golden typography floating over silk texture, Indian luxury brand lettering style, embossed metallic letters, crimson backdrop, no readable words',
    aspectRatio: '4:3',
  },
  {
    file: 'generative-recolor.jpg',
    prompt:
      'Vector fashion illustration with flowing color palette swatches, silk saree pattern recolored in gold crimson and emerald, design studio mood, no text',
    aspectRatio: '4:3',
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
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Saved ${asset.file} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return outPath;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${ASSETS.length} Creative Studio images...\n`);

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