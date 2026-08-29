!macro customInit
  ; Verifica se EqualizerAPO ja esta instalado antes de comecar
  IfFileExists "$PROGRAMFILES64\EqualizerAPO\EQApo.dll" eapo_pre_ok 0
  IfFileExists "$PROGRAMFILES\EqualizerAPO\EQApo.dll" eapo_pre_ok 0
    MessageBox MB_YESNO|MB_ICONQUESTION "EqualizerAPO nao foi detectado no seu sistema.$\n$\nO NEXO SOUND precisa do EqualizerAPO para funcionar.$\n$\nDeseja abrir a pagina de download agora?" IDYES eapo_open_page IDNO eapo_pre_ok
    eapo_open_page:
      ExecShell "open" "https://equalizerapo.com/download.html"
      MessageBox MB_OK|MB_ICONINFORMATION "Apos instalar o EqualizerAPO, volte e continue a instalacao do NEXO SOUND."
  eapo_pre_ok:
!macroend

!macro customInstall
  ; Tenta instalar EqualizerAPO automaticamente se nao existir
  IfFileExists "$PROGRAMFILES64\EqualizerAPO\EQApo.dll" eapo_ok 0
  IfFileExists "$PROGRAMFILES\EqualizerAPO\EQApo.dll" eapo_ok 0
    DetailPrint "EqualizerAPO nao encontrado. Tentando baixar..."
    NSISdl::download "https://sourceforge.net/projects/equalizerapo/files/latest/download" "$TEMP\EqualizerAPO.exe"
    Pop $R0
    StrCmp $R0 "success" eapo_install 0
      DetailPrint "Falha no download do Equalizer APO: $R0"
      MessageBox MB_OK|MB_ICONEXCLAMATION "Nao foi possivel baixar o EqualizerAPO automaticamente.$\n$\nPor favor, baixe e instale manualmente de:$\nhttps://equalizerapo.com/download.html$\n$\nO NEXO SOUND precisa do EqualizerAPO para funcionar."
      Goto eapo_ok
    eapo_install:
      DetailPrint "Instalando Equalizer APO..."
      ExecWait '"$TEMP\EqualizerAPO.exe" /S' $R0
      StrCmp $R0 0 eapo_ok 0
        DetailPrint "Instalacao do Equalizer APO retornou: $R0"
        MessageBox MB_OK|MB_ICONEXCLAMATION "A instalacao do EqualizerAPO pode nao ter sido concluida.$\n$\nVerifique se o EqualizerAPO foi instalado corretamente."
  eapo_ok:

  ; Cria o diretorio de config se necessario
  CreateDirectory "$PROGRAMFILES64\EqualizerAPO\config"

  ; Tenta instalar ReaPlugs se nao existir (opcional - para o compressor/limiter)
  IfFileExists "$PROGRAMFILES64\VSTPlugins\ReaPlugs\reacomp-standalone.dll" reaplugs_ok 0
  IfFileExists "$PROGRAMFILES\VSTPlugins\ReaPlugs\reacomp-standalone.dll" reaplugs_ok 0
    DetailPrint "ReaPlugs nao encontrado. Tentando baixar..."
    NSISdl::download "https://www.reaper.fm/reaplugs/reaplugs236_x64-install.exe" "$TEMP\reaplugs_x64.exe"
    Pop $R0
    StrCmp $R0 "success" reaplugs_install 0
      DetailPrint "Falha no download do ReaPlugs: $R0 (opcional)"
      Goto reaplugs_ok
    reaplugs_install:
      DetailPrint "Instalando ReaPlugs..."
      ExecWait '"$TEMP\reaplugs_x64.exe" /S' $R0
  reaplugs_ok:

  ; Permissao na pasta config do Equalizer APO
  IfFileExists "$PROGRAMFILES64\EqualizerAPO\config" 0 +2
    ExecWait 'icacls "$PROGRAMFILES64\EqualizerAPO\config" /grant "%USERNAME%:F" /T /Q'
!macroend
