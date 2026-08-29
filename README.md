<div align="center">
  <img src="public/icon.png" alt="NEXO SOUND Logo" width="120" />
  <h1>NEXO SOUND</h1>
  <p><strong>Unlock your Windows audio. Beyond 100%.</strong></p>

  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases/latest">
    <img src="https://img.shields.io/github/v/release/Jhin1v9/Nexo-Sound?color=00f0ff&style=for-the-badge" alt="Latest Release" />
  </a>
  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases">
    <img src="https://img.shields.io/github/downloads/Jhin1v9/Nexo-Sound/total?color=a855f7&style=for-the-badge" alt="Downloads" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Windows-10%2F11-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-ff2d8d?style=for-the-badge" alt="License" />
  </a>
</div>

---

## ✨ What is NEXO SOUND?

**NEXO SOUND** is a premium desktop audio control panel for Windows that lets you push your system volume past the native 100% limit. Built on top of the powerful **[Equalizer APO](https://sourceforge.net/projects/equalizerapo/)** engine, it delivers studio-grade volume boosting, real-time EQ, spatial audio effects, and a built-in compressor/limiter — all wrapped in a stunning glassmorphism interface.

Whether you want louder movies, punchier music, clearer voices, or a competitive edge in games, NEXO SOUND gives you full control.

---

## 🚀 Features

- **🔊 Volume Boost** — Push system volume from 0% up to **500%**
- **🎚️ 9-Band Equalizer** — Fine-tune Bass, Mids, and Treble
- **🎛️ Fx-Style Effects** — Clarity, Ambience, Surround, Dynamic Boost, Bass Boost
- **🛡️ Smart Limiter** — ReaComp integration prevents clipping and distortion
- **⚡ 13 One-Click Presets** — General, Movies, TV, Transcription, Music, Voice, Gaming, Bass Boost, and more
- **🪟 Glassmorphism UI** — Modern, frosted-glass design with Lucide icons
- **💾 Persistent State** — Your settings are saved automatically
- **🖥️ Native Desktop App** — Built with Electron, runs as a real Windows app

---

## 📥 Download

Get the latest installer and run it as administrator. The setup will automatically download and install **Equalizer APO** and **ReaPlugs** if they are not already present.

<p align="center">
  <a href="https://github.com/Jhin1v9/Nexo-Sound/releases/download/v2.0.1/NEXO.SOUND.Setup.2.0.0.exe">
    <img src="https://img.shields.io/badge/Download-NEXO%20SOUND%20Setup-00f0ff?style=for-the-badge&logo=windows&logoColor=white" alt="Download NEXO SOUND" />
  </a>
</p>

> ⚠️ **Requires administrator privileges** during installation because Equalizer APO installs as an audio driver.

---

## 🛠️ Installation

1. Click the **Download** button above.
2. Run `NEXO.SOUND.Setup.2.0.0.exe`.
3. Click **Yes** on the UAC prompt.
4. Wait while the installer sets up:
   - Equalizer APO
   - ReaPlugs (for the limiter/compressor)
   - NEXO SOUND app
5. Launch NEXO SOUND from your desktop shortcut.

---

## 📋 Requirements

| Requirement | Details |
|-------------|---------|
| OS | Windows 10 / 11 (64-bit) |
| Permissions | Administrator |
| Internet | Required during installation |
| Audio | Any Windows playback device supported by Equalizer APO |

---

## 🎮 How It Works

NEXO SOUND modifies your system's audio pipeline through **Equalizer APO**, a system-wide audio processing driver. It applies:

1. **Preamplification** to increase overall volume beyond Windows' 100% limit.
2. **Graphic EQ** to shape frequencies.
3. **Delay-based spatial effects** for ambience and surround width.
4. **ReaComp compression/limiting** to control peaks and avoid distortion.

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
cd volume-boost-panel

# Install dependencies
npm install

# Run in development mode
npm start

# Build the installer
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
- [ ] Auto-start with Windows
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

- [Equalizer APO](https://sourceforge.net/projects/equalizerapo/) — The engine behind system-wide audio processing
- [ReaPlugs](https://www.reaper.fm/reaplugs/) — Free VST compressor/effects suite
- [Lucide](https://lucide.dev/) — Beautiful open-source icons
- [Electron](https://www.electronjs.org/) — Cross-platform desktop framework

---

<div align="center">
  <sub>Built with 💜 by the NEXO SOUND team</sub>
</div>
