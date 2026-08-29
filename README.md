<div align="center">
  <img src="public/icon.png" alt="NEXO SOUND Logo" width="120" />
  <h1>NEXO SOUND</h1>
  <p><strong>Unlock your audio. Beyond 100%.</strong></p>

  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases/latest">
    <img src="https://img.shields.io/github/v/release/Jhin1v9/Nexo-Sound?color=00f0ff&style=for-the-badge" alt="Latest Release" />
  </a>
  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases">
    <img src="https://img.shields.io/github/downloads/Jhin1v9/Nexo-Sound/total?color=a855f7&style=for-the-badge" alt="Downloads" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Windows-10%2F11-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Linux-Ubuntu%2FDebian%2FFedora-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Linux" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-ff2d8d?style=for-the-badge" alt="License" />
  </a>
</div>

---

## ✨ What is NEXO SOUND?

**NEXO SOUND** is a premium desktop audio control panel that lets you push your system volume past the native 100% limit. On Windows it leverages the powerful **[Equalizer APO](https://sourceforge.net/projects/equalizerapo/)** engine for system-wide boosting, EQ, spatial effects and compression. On Linux it integrates directly with **PulseAudio** and **PipeWire** for instant volume control.

Whether you want louder movies, punchier music, clearer voices, or a competitive edge in games, NEXO SOUND gives you full control through a stunning glassmorphism interface.

---

## 🚀 Features

- **🔊 Volume Boost** — Push system volume from 0% up to **500%**
- **🎚️ 9-Band Equalizer** — Fine-tune Bass, Mids, and Treble
- **🎛️ Fx-Style Effects** — Clarity, Ambience, Surround, Dynamic Boost, Bass Boost
- **🛡️ Smart Limiter** — ReaComp integration prevents clipping and distortion *(Windows)*
- **⚡ 13 One-Click Presets** — General, Movies, TV, Transcription, Music, Voice, Gaming, Bass Boost, and more
- **🪟 Glassmorphism UI** — Modern, frosted-glass design with Lucide icons
- **💾 Persistent State** — Your settings are saved automatically
- **🖥️ Native Desktop App** — Built with Electron for Windows and Linux
- **📦 npm Global Install** — Run `npm install -g nexo-sound` and launch with `nexo-sound`

---

## 📥 Download

### Windows

Get the latest installer and run it as administrator. The setup will automatically download and install **Equalizer APO** and **ReaPlugs** if they are not already present.

<p align="center">
  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases/download/v2.0.1/NEXO.SOUND.Setup.2.0.0.exe">
    <img src="https://img.shields.io/badge/Download-NEXO%20SOUND%20Setup-00f0ff?style=for-the-badge&logo=windows&logoColor=white" alt="Download NEXO SOUND for Windows" />
  </a>
</p>

> ⚠️ **Requires administrator privileges** during installation because Equalizer APO installs as an audio driver.

### Linux

Install directly from npm and run from anywhere:

```bash
npm install -g nexo-sound
nexo-sound
```

Or install the latest version directly from GitHub:

```bash
npm install -g github:Jhin1v9/Nexo-Sound
nexo-sound
```

> 💡 **Requirements:** `pactl` (PulseAudio) or `wpctl` (PipeWire) must be available in your PATH.

---

## 🛠️ Installation

### Windows

1. Click the **Download** button above.
2. Run `NEXO.SOUND.Setup.2.0.0.exe`.
3. Click **Yes** on the UAC prompt.
4. Wait while the installer sets up:
   - Equalizer APO
   - ReaPlugs (for the limiter/compressor)
   - NEXO SOUND app
5. Launch NEXO SOUND from your desktop shortcut.

### Linux

```bash
# Install globally via npm
npm install -g nexo-sound

# Launch the app
nexo-sound
```

To update:

```bash
npm update -g nexo-sound
```

To uninstall:

```bash
npm uninstall -g nexo-sound
```

---

## 📋 Requirements

### Windows

| Requirement | Details |
|-------------|---------|
| OS | Windows 10 / 11 (64-bit) |
| Permissions | Administrator |
| Internet | Required during installation |
| Audio | Any Windows playback device supported by Equalizer APO |

### Linux

| Requirement | Details |
|-------------|---------|
| OS | Ubuntu, Debian, Fedora, Arch or any modern distro |
| Runtime | Node.js 18+ |
| Audio | PulseAudio (`pactl`) or PipeWire (`wpctl`) |
| Display | X11 or Wayland with Electron support |

---

## 🎮 How It Works

### Windows

NEXO SOUND modifies your system's audio pipeline through **Equalizer APO**, a system-wide audio processing driver. It applies:

1. **Preamplification** to increase overall volume beyond Windows' 100% limit.
2. **Graphic EQ** to shape frequencies.
3. **Delay-based spatial effects** for ambience and surround width.
4. **ReaComp compression/limiting** to control peaks and avoid distortion.

### Linux

NEXO SOUND talks directly to your default audio sink through **PipeWire** (`wpctl`) or **PulseAudio** (`pactl`), allowing volume values above 100% when supported by the server configuration.

Everything happens in real time. No need to restart your audio apps.

---

## 🎯 Presets

| Preset | Best For |
|--------|----------|
| **General** | Everyday use |
| **Movies** | Cinematic impact and bass |
| **TV** | Clear dialogue |
| **Transcription** | Voice clarity |
| **Music** | Balanced listening |
| **Voice** | Calls and podcasts |
| **Volume Boost** | Maximum loudness |
| **Gaming** | Spatial awareness |
| **Bass Boost** | Heavy bass |
| **Streaming** | Content creation |

---

## 🖼️ Interface

NEXO SOUND features a premium dark interface with animated gradient orbs, frosted-glass cards, and Lucide icons throughout.

<!-- Replace with a real screenshot when available -->
<!-- ![NEXO SOUND Interface](screenshots/app.png) -->

---

## 🧑‍💻 Development

Want to run or modify the source code?

```bash
# Clone the repository
git clone https://github.com/Jhin1v9/Nexo-Sound.git
cd Nexo-Sound

# Install dependencies
npm install

# Run in development mode
npm start

# Build installers
npm run build
```

---

## ⚠️ Safety Notes

- Avoid using **300%+** for long periods with headphones to protect your hearing.
- The limiter reduces distortion but cannot fix poor-quality source audio.
- Some sensitive audio hardware may produce noise at extreme boost levels.

---

## 🗺️ Roadmap

- [ ] Custom user presets
- [ ] Audio visualizer
- [ ] Per-app volume profiles
- [ ] Auto-start with system
- [ ] System tray minimization
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Equalizer APO](https://sourceforge.net/projects/equalizerapo/) — System-wide audio processing on Windows
- [ReaPlugs](https://www.reaper.fm/reaplugs/) — Free VST compressor/effects suite
- [Lucide](https://lucide.dev/) — Beautiful open-source icons
- [Electron](https://www.electronjs.org/) — Cross-platform desktop framework

---

<div align="center">
  <sub>Built with 💜 by the NEXO SOUND team</sub>
</div>
