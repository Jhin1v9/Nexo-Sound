const { Jimp, rgbaToInt } = require('jimp');
const path = require('path');

const size = 256;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

async function createIcon() {
  const image = new Jimp({ width: size, height: size, color: 0x00000000 });

  // Fundo arredondado com gradiente profundo
  const corner = 48;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // cantos arredondados
      const dx = Math.max(corner - x, x - (size - corner), 0);
      const dy = Math.max(corner - y, y - (size - corner), 0);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > corner) continue;

      const t = y / size;
      // gradiente roxo -> azul neon
      const r = Math.round(lerp(60, 0, t));
      const g = Math.round(lerp(20, 180, t));
      const b = Math.round(lerp(80, 255, t));
      image.setPixelColor(rgbaToInt(r, g, b, 255), x, y);
    }
  }

  const white = rgbaToInt(255, 255, 255, 255);
  const cyan = rgbaToInt(0, 240, 255, 255);
  const pink = rgbaToInt(255, 45, 141, 255);

  // Desenha ondas sonoras estilizadas
  const bars = [
    { x: 70, h: 45, w: 14, color: white },
    { x: 96, h: 80, w: 16, color: cyan },
    { x: 124, h: 110, w: 20, color: pink },
    { x: 156, h: 75, w: 16, color: cyan },
    { x: 184, h: 50, w: 14, color: white }
  ];

  bars.forEach(bar => {
    const top = (size - bar.h) / 2;
    for (let y = Math.floor(top); y < Math.floor(top + bar.h); y++) {
      for (let x = bar.x; x < bar.x + bar.w; x++) {
        // cantos arredondados nas barras
        const relY = y - top;
        const radius = bar.w / 2;
        const inTopRound = relY < radius && Math.abs((x - bar.x) + 0.5 - bar.w / 2) > Math.sqrt(radius * radius - (radius - relY) ** 2);
        const inBottomRound = relY > bar.h - radius && Math.abs((x - bar.x) + 0.5 - bar.w / 2) > Math.sqrt(radius * radius - (relY - (bar.h - radius)) ** 2);
        if (inTopRound || inBottomRound) continue;
        image.setPixelColor(bar.color, x, y);
      }
    }
  });

  const pngPath = path.join(__dirname, 'public', 'icon.png');
  await image.write(pngPath);
  console.log('Icone NEXO SOUND criado:', pngPath);
}

createIcon().catch(console.error);
