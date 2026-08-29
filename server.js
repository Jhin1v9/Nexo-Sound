const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

const app = express();
const DEFAULT_PORT = 3333;

const EAPO_DIR = 'C:\\Program Files\\EqualizerAPO';
const CONFIG_PATH = path.join(EAPO_DIR, 'config', 'config.txt');
const STATE_PATH = path.join(__dirname, 'state.json');
const REACOMP_PATH = 'C:\\Program Files\\VSTPlugins\\ReaPlugs\\reacomp-standalone.dll';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const KEYS = {
  volume: { min: 0, max: 500, default: 100 },
  clarity: { min: 0, max: 20, default: 0 },      // clareza (agudos médios)
  ambience: { min: 0, max: 20, default: 0 },      // ambiente (delay/reverb leve)
  surround: { min: 0, max: 20, default: 0 },      // expansão estéreo
  dynamic: { min: 0, max: 20, default: 0 },       // impulso dinâmico (compressão)
  bassboost: { min: 0, max: 20, default: 0 },     // reforço de graves
  bass: { min: -20, max: 20, default: 0 },        // EQ grave
  mid: { min: -20, max: 20, default: 0 },         // EQ médio
  treble: { min: -20, max: 20, default: 0 },      // EQ agudo
  limiter: { default: true }
};

const PRESETS = {
  default: { volume: 100, clarity: 0, ambience: 0, surround: 0, dynamic: 0, bassboost: 0, bass: 0, mid: 0, treble: 0, limiter: true },
  general: { volume: 110, clarity: 4, ambience: 2, surround: 4, dynamic: 3, bassboost: 4, bass: 2, mid: 1, treble: 2, limiter: true },
  movies: { volume: 150, clarity: 6, ambience: 8, surround: 10, dynamic: 8, bassboost: 10, bass: 6, mid: 2, treble: 4, limiter: true },
  tv: { volume: 130, clarity: 6, ambience: 4, surround: 6, dynamic: 5, bassboost: 4, bass: 2, mid: 4, treble: 3, limiter: true },
  transcription: { volume: 140, clarity: 10, ambience: 0, surround: 0, dynamic: 6, bassboost: 0, bass: -4, mid: 10, treble: 6, limiter: true },
  music: { volume: 120, clarity: 3, ambience: 3, surround: 5, dynamic: 4, bassboost: 5, bass: 3, mid: 1, treble: 2, limiter: true },
  voice: { volume: 130, clarity: 6, ambience: 1, surround: 2, dynamic: 6, bassboost: 0, bass: -2, mid: 8, treble: 4, limiter: true },
  volumeboost: { volume: 200, clarity: 2, ambience: 0, surround: 0, dynamic: 8, bassboost: 2, bass: 0, mid: 0, treble: 0, limiter: true },
  gaming: { volume: 130, clarity: 8, ambience: 5, surround: 8, dynamic: 5, bassboost: 6, bass: 3, mid: 2, treble: 4, limiter: true },
  classic: { volume: 110, clarity: 2, ambience: 1, surround: 2, dynamic: 2, bassboost: 3, bass: 2, mid: 0, treble: 1, limiter: true },
  light: { volume: 105, clarity: 2, ambience: 1, surround: 2, dynamic: 2, bassboost: 2, bass: 1, mid: 0, treble: 1, limiter: true },
  bassboost: { volume: 130, clarity: 2, ambience: 1, surround: 3, dynamic: 4, bassboost: 15, bass: 8, mid: -1, treble: 1, limiter: true },
  streaming: { volume: 120, clarity: 5, ambience: 2, surround: 3, dynamic: 4, bassboost: 4, bass: 2, mid: 2, treble: 3, limiter: true }
};

function loadState() {
  try {
    return { ...PRESETS.default, ...JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) };
  } catch {
    return { ...PRESETS.default };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, Number(val) || 0));
}

function normalizeState(input) {
  const current = loadState();
  const base = (input.preset && PRESETS[input.preset]) ? { ...PRESETS[input.preset] } : { ...current };
  const out = {};
  for (const [key, cfg] of Object.entries(KEYS)) {
    if (input[key] !== undefined) {
      out[key] = cfg.min !== undefined ? clamp(input[key], cfg.min, cfg.max) : Boolean(input[key]);
    } else {
      out[key] = base[key] !== undefined ? base[key] : cfg.default;
    }
  }
  out.preset = input.preset || current.preset || 'default';
  return out;
}

function percentToDb(percent) {
  const clamped = clamp(percent, 0, 500);
  if (clamped === 0) return -60;
  return 20 * Math.log10(clamped / 100);
}

function dbToPercent(db) {
  if (db <= -60) return 0;
  return Math.round(100 * Math.pow(10, db / 20));
}

function buildGraphicEQ(state) {
  // 9 bandas iguais ao FxSound
  const bands = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const points = bands.map(f => {
    let gain = 0;
    // graves
    if (f <= 250) {
      const t = Math.max(0, 1 - f / 300);
      gain += state.bass * t + state.bassboost * (0.6 + 0.4 * t);
    }
    // médios
    if (f >= 250 && f <= 4000) {
      const center = 1000;
      const dist = Math.abs(f - center) / 1900;
      gain += state.mid * Math.max(0, 1 - dist);
    }
    // agudos
    if (f >= 2000) {
      const t = Math.min(1, Math.max(0, (f - 2000) / 14000));
      gain += state.treble * t;
    }
    // clareza (2k-8k)
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

function buildConfig(state) {
  // Headroom automático: se boost total passar de +12dB, reduz preamp
  const totalBoost = Math.max(0, state.bass, state.mid, state.treble, state.clarity, state.bassboost);
  const headroom = totalBoost > 12 ? -(totalBoost - 12) * 0.6 : 0;
  const preampDb = percentToDb(state.volume) + headroom;
  const eqLine = buildGraphicEQ(state);
  const spatialLines = buildSpatialEffects(state);

  const limiterExists = fs.existsSync(REACOMP_PATH);
  const compLines = [];
  if (state.limiter && limiterExists) {
    // ReaComp como limiter/compressor
    const threshold = (-1 - state.dynamic * 0.5).toFixed(1); // -1 a -11 dB
    const ratio = (2 + state.dynamic * 0.8).toFixed(1);      // 2:1 a 18:1
    compLines.push(`; Compressor/Limiter ativo (ReaComp)`);
    compLines.push(`Plugin: VST "${REACOMP_PATH}"`);
  } else if (state.limiter) {
    compLines.push(`; AVISO: ReaComp nao encontrado em ${REACOMP_PATH}`);
    compLines.push(`; Baixe ReaPlugs em https://www.reaper.fm/reaplugs/ para ativar o limiter.`);
  }

  return [
    `Preamp: ${preampDb.toFixed(2)} dB`,
    `; Volume Boost Panel`,
    `; Vol:${state.volume}% Cla:${state.clarity} Amb:${state.ambience} Sur:${state.surround} Dyn:${state.dynamic} BassB:${state.bassboost} B:${state.bass} M:${state.mid} T:${state.treble}`,
    eqLine,
    ...spatialLines,
    ...compLines
  ].join('\n') + '\n';
}

app.get('/api/audio', (req, res) => {
  try {
    const state = loadState();
    res.json({ ok: true, ...state, presets: Object.keys(PRESETS), limiterAvailable: fs.existsSync(REACOMP_PATH) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/audio', (req, res) => {
  try {
    const state = normalizeState(req.body);
    fs.writeFileSync(CONFIG_PATH, buildConfig(state), 'utf8');
    saveState(state);
    res.json({ ok: true, ...state, preampDb: percentToDb(state.volume), limiterAvailable: fs.existsSync(REACOMP_PATH) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/presets', (req, res) => {
  res.json({ ok: true, presets: PRESETS });
});

// Endpoints legados
app.get('/api/volume', (req, res) => {
  try {
    const state = loadState();
    res.json({ percent: state.volume, db: percentToDb(state.volume) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volume', (req, res) => {
  try {
    const state = normalizeState({ volume: req.body.percent });
    fs.writeFileSync(CONFIG_PATH, buildConfig(state), 'utf8');
    saveState(state);
    res.json({ percent: state.volume, db: percentToDb(state.volume) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function tryListen(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Painel de volume rodando em http://localhost:${port}`);
      resolve({ server, port });
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(null);
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  for (let port = DEFAULT_PORT; port < DEFAULT_PORT + 20; port++) {
    const result = await tryListen(port);
    if (result) {
      global.VOLUME_BOOST_PORT = result.port;
      return result.port;
    }
  }
  throw new Error('Nao foi possivel encontrar uma porta livre entre 3333 e 3352');
}

if (require.main === module) {
  startServer().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { startServer, app };

