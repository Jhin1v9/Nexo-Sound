const { Jimp, rgbaToInt } = require('jimp');
const path = require('path');

const size = 256;

async function createIcon() {
  const image = new Jimp({ width: size, height: size, color: 0x00000000 });

  // Fundo circular gradiente
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2;
      const cy = y - size / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      if (dist < size / 2 - 4) {
        const t = (dist / (size / 2)) * 255;
        const r = Math.max(0, Math.min(255, 0));
        const g = Math.max(0, Math.min(255, Math.round(212 - t * 0.3)));
        const b = Math.max(0, Math.min(255, 255));
        image.setPixelColor(rgbaToInt(r, g, b, 255), x, y);
      }
    }
  }

  // Simbolo de alto-falante
  const speakerColor = rgbaToInt(255, 255, 255, 255);
  const centerX = size / 2 - 10;
  const centerY = size / 2;

  // cone do alto-falante (triangulo)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      // corpo triangular
      if (x >= centerX - 50 && x <= centerX + 20) {
        const widthAtY = 30 + Math.abs(dy) * 0.5;
        if (Math.abs(dy) < widthAtY && Math.abs(dx) < 50 - Math.abs(dy) * 0.4) {
          image.setPixelColor(speakerColor, x, y);
        }
      }
    }
  }

  // ondas sonoras
  for (let i = 0; i < 3; i++) {
    const radius = 35 + i * 18;
    for (let angle = -60; angle <= 60; angle += 2) {
      const rad = (angle * Math.PI) / 180;
      const x = Math.round(centerX + 30 + Math.cos(rad) * radius);
      const y = Math.round(centerY + Math.sin(rad) * radius);
      for (let ox = -3; ox <= 3; ox++) {
        for (let oy = -3; oy <= 3; oy++) {
          if (x + ox >= 0 && x + ox < size && y + oy >= 0 && y + oy < size) {
            image.setPixelColor(speakerColor, x + ox, y + oy);
          }
        }
      }
    }
  }

  const pngPath = path.join(__dirname, 'public', 'icon.png');
  await image.write(pngPath);
  console.log('Icone criado:', pngPath);
}

createIcon().catch(console.error);
