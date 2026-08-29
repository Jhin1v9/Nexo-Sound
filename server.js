const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getDataDir() {
  if (process.type === 'browser' || process.type === 'renderer') {
    try {
      const { app } = require('electron');
      return app.getPath('userData');
    } catch {
      // fallback
    }
  }
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    return __dirname;
  }
  return os.homedir();
}

const DATA_DIR = getDataDir();
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const app = express();
const DEFAULT_PORT = 3333;
const IS_WINDOWS = process.platform === 'win32';
const IS_LINUX = process.platform === 'linux';

const backend = IS_WINDOWS
  ? require('./backends/windows')
  : IS_LINUX
    ? require('./backends/linux')
    : require('./backends/windows');

const STATE_PATH = path.join(DATA_DIR, 'state.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const KEYS = {
  volume: { min: 0, max: 500, default: 100 },
  clarity: { min: 0, max: 20, default: 0 },
  ambience: { min: 0, max: 20, default: 0 },
  surround: { min: 0, max: 20, default: 0 },
  dynamic: { min: 0, max: 20, default: 0 },
  bassboost: { min: 0, max: 20, default: 0 },
  bass: { min: -20, max: 20, default: 0 },
  mid: { min: -20, max: 20, default: 0 },
  treble: { min: -20, max: 20, default: 0 },
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

const backendInfo = backend.getInfo();

app.get('/api/audio', (req, res) => {
  try {
    const state = loadState();
    res.json({
      ok: true,
      ...state,
      presets: Object.keys(PRESETS),
      limiterAvailable: backendInfo.limiterAvailable || false,
      platform: process.platform,
      backend: backendInfo.method || (IS_WINDOWS ? 'EqualizerAPO' : 'PulseAudio/PipeWire')
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/audio', async (req, res) => {
  try {
    const state = normalizeState(req.body);
    const result = await backend.apply(state);
    saveState(state);
    res.json({
      ok: true,
      ...state,
      preampDb: percentToDb(state.volume),
      limiterAvailable: backendInfo.limiterAvailable || false,
      platform: process.platform,
      backend: result.method || result.platform
    });
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

app.post('/api/volume', async (req, res) => {
  try {
    const state = normalizeState({ volume: req.body.percent });
    await backend.apply(state);
    saveState(state);
    res.json({ percent: state.volume, db: percentToDb(state.volume) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function tryListen(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`NEXO SOUND rodando em http://localhost:${port}`);
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
      global.NEXO_SOUND_PORT = result.port;
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
