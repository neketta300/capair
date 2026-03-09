const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createIcon(size, filename) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FAF8F5"/>
      <stop offset="100%" style="stop-color:#F5F2ED"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.167)}" fill="url(#bg-${size})"/>
  <rect x="${Math.round(size * 0.25)}" y="${Math.round(size * 0.25)}" width="${Math.round(size * 0.5)}" height="${Math.round(size * 0.625)}" rx="${Math.round(size * 0.042)}" fill="#2C3E50"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.31)}" width="${Math.round(size * 0.4)}" height="${Math.round(size * 0.042)}" rx="${Math.round(size * 0.02)}" fill="#D4A853"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.4)}" width="${Math.round(size * 0.31)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.48)}" width="${Math.round(size * 0.35)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.55)}" width="${Math.round(size * 0.27)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <circle cx="${Math.round(size * 0.75)}" cy="${Math.round(size * 0.75)}" r="${Math.round(size * 0.125)}" fill="#D4A853"/>
  <path d="M${Math.round(size * 0.71)} ${Math.round(size * 0.75)} L${Math.round(size * 0.74)} ${Math.round(size * 0.78)} L${Math.round(size * 0.79)} ${Math.round(size * 0.72)}" stroke="#2C3E50" stroke-width="${Math.round(size * 0.02)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `.trim();

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'icons', filename));
  
  console.log(`Created ${filename}`);
}

async function createMaskableIcon(size, filename) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg-mask-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FAF8F5"/>
      <stop offset="100%" style="stop-color:#F5F2ED"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg-mask-${size})"/>
  <rect x="${Math.round(size * 0.25)}" y="${Math.round(size * 0.25)}" width="${Math.round(size * 0.5)}" height="${Math.round(size * 0.625)}" rx="${Math.round(size * 0.042)}" fill="#2C3E50"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.31)}" width="${Math.round(size * 0.4)}" height="${Math.round(size * 0.042)}" rx="${Math.round(size * 0.02)}" fill="#D4A853"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.4)}" width="${Math.round(size * 0.31)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.48)}" width="${Math.round(size * 0.35)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <rect x="${Math.round(size * 0.3)}" y="${Math.round(size * 0.55)}" width="${Math.round(size * 0.27)}" height="${Math.round(size * 0.03)}" rx="${Math.round(size * 0.015)}" fill="#D4A853" opacity="0.7"/>
  <circle cx="${Math.round(size * 0.75)}" cy="${Math.round(size * 0.75)}" r="${Math.round(size * 0.125)}" fill="#D4A853"/>
  <path d="M${Math.round(size * 0.71)} ${Math.round(size * 0.75)} L${Math.round(size * 0.74)} ${Math.round(size * 0.78)} L${Math.round(size * 0.79)} ${Math.round(size * 0.72)}" stroke="#2C3E50" stroke-width="${Math.round(size * 0.02)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `.trim();

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'icons', filename));
  
  console.log(`Created ${filename}`);
}

async function main() {
  console.log('Generating PWA icons...');
  
  await createIcon(192, 'icon-192.png');
  await createIcon(512, 'icon-512.png');
  await createMaskableIcon(192, 'icon-maskable-192.png');
  await createMaskableIcon(512, 'icon-maskable-512.png');
  
  console.log('All icons generated successfully!');
}

main().catch(console.error);
