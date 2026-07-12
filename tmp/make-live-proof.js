const sharp = require('sharp');
const path = require('path');

(async () => {
  const liveIcon = path.join(__dirname, 'live-cart-icon.png');
  const out = path.join(__dirname, 'live-navbar-cart-crop.png');
  const verify = path.join(__dirname, 'cart-v6-verify.png');

  const icon34 = await sharp(liveIcon)
    .resize(34, 34, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const icon96 = await sharp(liveIcon)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const svg = Buffer.from(`
    <svg width="1100" height="240" xmlns="http://www.w3.org/2000/svg">
      <rect width="1100" height="34" fill="#6B1515"/>
      <text x="550" y="22" fill="#f5e6c8" font-size="12" text-anchor="middle" font-family="system-ui">
        LIVE CDN: https://sampadaoriginals.in/icons/sampada-cart.png — 128×128 · 9759 bytes · V6
      </text>
      <rect y="34" width="1100" height="90" fill="#FAF6F0"/>
      <text x="40" y="90" fill="#8B1A1A" font-size="30" font-family="Georgia" font-style="italic">Sampada</text>
      <text x="880" y="88" fill="#1a1a1a" font-size="14" font-family="system-ui">Sign In</text>
      <rect y="140" width="1100" height="100" fill="#FAF6F0"/>
      <text x="40" y="195" fill="#555" font-size="13" font-family="system-ui">Production V6 asset (downloaded from live CDN after deploy)</text>
    </svg>
  `);

  await sharp(svg)
    .composite([
      { input: icon34, top: 62, left: 980 },
      { input: icon96, top: 148, left: 500 },
    ])
    .png()
    .toFile(out);

  console.log('wrote', out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
