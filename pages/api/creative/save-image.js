// pages/api/creative/save-image.js
// Download a generated image URL and save it to public/images/creative-studio/generated/

import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'creative-studio', 'generated');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, filename } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    if (!imageUrl.startsWith('https://')) {
      return res.status(400).json({ error: 'Only remote HTTPS image URLs are supported' });
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return res.status(502).json({ error: 'Failed to download image from source URL' });
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const safeName = (filename || `sampada-${Date.now()}`)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 80);
    const finalName = `${safeName}.${ext}`;

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    const filePath = path.join(OUT_DIR, finalName);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/images/creative-studio/generated/${finalName}`;
    return res.status(200).json({
      saved: true,
      path: publicPath,
      filename: finalName,
      sizeKb: Math.round(buffer.length / 1024),
    });
  } catch (err) {
    console.error('Save image error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}