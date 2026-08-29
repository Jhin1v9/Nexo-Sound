const fs = require('fs');
const path = require('path');

const EAPO_DIR = 'C:\\Program Files\\EqualizerAPO';
const CONFIG_PATH = path.join(EAPO_DIR, 'config', 'config.txt');
const REACOMP_PATH = 'C:\\Program Files\\VSTPlugins\\ReaPlugs\\reacomp-standalone.dll';

function buildGraphicEQ(state) {
  const bands = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const points = bands.map(f => {
    let gain = 0;
    if (f <= 250) {
      const t = Math.max(0, 1 - f / 300);
      gain += state.bass * t + state.bassboost * (0.6 + 0.4 * t);
    }
    if (f >= 250 && f <= 4000) {
      const center = 1000;
      const dist = Math.abs(f - center) / 1900;
      gain += state.mid * Math.max(0, 1 - dist);
    }
    if (f >= 2000) {
      const t = Math.min(1, Math.max(0, (f - 2000) / 14000));
      gain += state.treble * t;
    }
    if (f >= 2000 && f <= 8000) {
      const center = 4000;
      const dist = Math.abs(f - center) / 3000;
      gain += state.clarity * Math.max(0, 1 - dist);
    }
    return `${f} ${gain.toFixed(1)}`;
  });
  return `GraphicEQ: ${points.join('; ')}`;
}

function buildSpatialEffects(state) {
  const lines = [];
  if (state.ambience > 0) {
    const ms = (state.ambience * 0.5).toFixed(1);
    lines.push(`; Ambiente: delay curto`);
    lines.push(`Delay: ${ms} ms 0.0 ms`);
  }
  if (state.surround > 0) {
    const delayMs = (state.surround * 0.25).toFixed(1);
    lines.push(`; Surround: expansão estéreo`);
    lines.push(`Delay: 0.0 ms ${delayMs} ms`);
  }
  return lines;
}

function percentToDb(percent) {
  const clamped = Math.max(0, Math.min(500, Number(percent) || 0));
  if (clamped === 0) return -60;
  return 20 * Math.log10(clamped / 100);
}

function buildConfig(state) {
  const maxBoost = Math.max(0, state.bass, state.mid, state.treble, state.clarity, state.bassboost);
  const headroom = maxBoost > 12 ? -(maxBoost - 12) * 0.6 : 0;
  const preampDb = percentToDb(state.volume) + headroom;
  const eqLine = buildGraphicEQ(state);
  const spatialLines = buildSpatialEffects(state);

  const limiterExists = fs.existsSync(REACOMP_PATH);
  const compLines = [];
  if (state.limiter && limiterExists) {
    compLines.push(`; Compressor/Limiter ativo (ReaComp)`);
    compLines.push(`Plugin: VST "${REACOMP_PATH}"`);
  } else if (state.limiter) {
    compLines.push(`; AVISO: ReaComp nao encontrado em ${REACOMP_PATH}`);
    compLines.push(`; Baixe ReaPlugs em https://www.reaper.fm/reaplugs/ para ativar o limiter.`);
  }

  return [
    `Preamp: ${preampDb.toFixed(2)} dB`,
    `; NEXO SOUND`,
    `; Vol:${state.volume}% Cla:${state.clarity} Amb:${state.ambience} Sur:${state.surround} Dyn:${state.dynamic} BassB:${state.bassboost} B:${state.bass} M:${state.mid} T:${state.treble}`,
    eqLine,
    ...spatialLines,
    ...compLines
  ].join('\n') + '\n';
}

async function apply(state) {
  fs.writeFileSync(CONFIG_PATH, buildConfig(state), 'utf8');
  return { platform: 'windows', method: 'EqualizerAPO' };
}

function getInfo() {
  return {
    available: fs.existsSync(EAPO_DIR),
    limiterAvailable: fs.existsSync(REACOMP_PATH),
    configPath: CONFIG_PATH
  };
}

module.exports = { apply, getInfo, percentToDb };
