# Volume Boost 500%

Painel desktop para aumentar o volume global do Windows além do limite de 100%, com equalizador, efeitos estilo FxSound e limiter/ compressor para evitar distorção.

## Funcionalidades

- **Volume Boost**: 0% a 500%
- **Efeitos FxSound**: Clareza, Ambiente, Surround, Impulso Dinâmico, Reforço de Graves
- **Equalizador manual**: Graves, Médios, Agudos
- **Limiter / Compressor**: ReaComp para evitar que o som estoure
- **13 presets**: Padrão, Geral, Filmes, TV, Transcrição, Música, Voz, Volume Boost, Gaming, Classic, Light, Bass Boost, Streaming

## Como usar

### Opção 1: Instalador completo (recomendado)

Baixe e execute:

```
dist/Volume Boost 500% Setup 1.0.0.exe
```

O instalador configura tudo automaticamente:
- Equalizer APO
- ReaPlugs
- App desktop

### Opção 2: Setup Wizard (modo desenvolvedor)

Execute como administrador:

```bash
setup.bat
```

### Opção 3: Manual

1. Instale o [Equalizer APO](https://sourceforge.net/projects/equalizerapo/)
2. Instale o [ReaPlugs](https://www.reaper.fm/reaplugs/)
3. Execute:

```bash
npm install
npm start
```

## Requisitos

- Windows 10/11 64-bit
- Permissão de administrador
- Conexão com internet durante a instalação

## Avisos

- Não use volumes muito altos (300%+) com fones de ouvido por longos períodos.
- O limiter ajuda a evitar distorção, mas não elimina completamente o ruído de fundo de áudios de baixa qualidade.

## Licença

MIT
