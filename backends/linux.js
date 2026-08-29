const { execSync } = require('child_process');

function commandExists(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getDefaultSink() {
  try {
    if (commandExists('wpctl')) {
      const out = execSync('wpctl status', { encoding: 'utf8' });
      const match = out.match(/\*\s+(\d+)\./);
      return match ? match[1] : null;
    }
    if (commandExists('pactl')) {
      const out = execSync('pactl info', { encoding: 'utf8' });
      const match = out.match(/Default Sink:\s*(.+)/);
      return match ? match[1].trim() : null;
    }
  } catch {
    return null;
  }
}

function percentToVolume(percent) {
  const clamped = Math.max(0, Math.min(500, Number(percent) || 0));
  if (commandExists('wpctl')) {
    return (clamped / 100).toFixed(2);
  }
  return `${clamped}%`;
}

async function apply(state) {
  const sink = getDefaultSink();
  if (!sink) {
    throw new Error('Nenhum sink de audio padrao encontrado. Verifique se PulseAudio ou PipeWire estao rodando.');
  }

  const vol = percentToVolume(state.volume);

  try {
    if (commandExists('wpctl')) {
      execSync(`wpctl set-volume ${sink} ${vol}`, { stdio: 'ignore' });
    } else if (commandExists('pactl')) {
      execSync(`pactl set-sink-volume ${sink} ${vol}`, { stdio: 'ignore' });
    } else {
      throw new Error('Nem wpctl (PipeWire) nem pactl (PulseAudio) foram encontrados.');
    }
  } catch (err) {
    throw new Error(`Falha ao aplicar volume: ${err.message}`);
  }

  // Nota: equalizacao e efeitos espaciais no Linux exigiria um equalizador global
  // como EasyEffects ou PulseEffects. Aqui aplicamos apenas o volume.
  return { platform: 'linux', method: commandExists('wpctl') ? 'PipeWire' : 'PulseAudio' };
}

function getInfo() {
  const wpctl = commandExists('wpctl');
  const pactl = commandExists('pactl');
  return {
    available: wpctl || pactl,
    wpctl,
    pactl,
    defaultSink: getDefaultSink()
  };
}

function percentToDb(percent) {
  const clamped = Math.max(0, Math.min(500, Number(percent) || 0));
  if (clamped === 0) return -60;
  return 20 * Math.log10(clamped / 100);
}

module.exports = { apply, getInfo, percentToDb };
