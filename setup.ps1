#Requires -RunAsAdministrator
param(
    [switch]$InstallOnly,
    [switch]$NoLaunch
)

$ErrorActionPreference = "Stop"
$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EapoDir = "C:\Program Files\EqualizerAPO"
$ReaplugsDir = "C:\Program Files\VSTPlugins\ReaPlugs"

function Write-Title($text) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Test-Command($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Wait-ForFile($path, $timeoutSec = 60) {
    $elapsed = 0
    while (-not (Test-Path $path) -and $elapsed -lt $timeoutSec) {
        Start-Sleep -Seconds 1
        $elapsed++
    }
    return Test-Path $path
}

Write-Title "NEXO SOUND - Setup Wizard"
Write-Host "Diretorio de instalacao: $BaseDir" -ForegroundColor Gray

# 1. Node.js
if (-not (Test-Command "node")) {
    Write-Host "Node.js nao encontrado. Baixando instalador..." -ForegroundColor Yellow
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $nodeInstaller = "$env:TEMP\nodejs.msi"
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
    Write-Host "Instalando Node.js..." -ForegroundColor Yellow
    Start-Process msiexec.exe -ArgumentList "/i","`"$nodeInstaller`"","/qn" -Wait
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    if (-not (Test-Command "node")) {
        throw "Falha ao instalar Node.js. Reinicie o computador e tente novamente."
    }
} else {
    Write-Host "Node.js ja instalado: $(node --version)" -ForegroundColor Green
}

# 2. Equalizer APO
if (-not (Test-Path $EapoDir)) {
    Write-Host "Equalizer APO nao encontrado. Baixando..." -ForegroundColor Yellow
    $eapoUrl = "https://sourceforge.net/projects/equalizerapo/files/latest/download"
    $eapoInstaller = "$env:TEMP\EqualizerAPO.exe"
    Invoke-WebRequest -Uri $eapoUrl -OutFile $eapoInstaller -UseBasicParsing
    if ((Get-Item $eapoInstaller).Length -lt 1MB) {
        throw "Download do Equalizer APO falhou ou veio vazio."
    }
    Write-Host "Instalando Equalizer APO (confirme o UAC)..." -ForegroundColor Yellow
    Start-Process -FilePath $eapoInstaller -ArgumentList "/S" -Wait -Verb RunAs
    if (-not (Wait-ForFile "$EapoDir\config\config.txt" 120)) {
        throw "Equalizer APO nao foi instalado corretamente."
    }
} else {
    Write-Host "Equalizer APO ja instalado." -ForegroundColor Green
}

# 3. ReaPlugs
if (-not (Test-Path "$ReaplugsDir\reacomp-standalone.dll")) {
    Write-Host "ReaPlugs nao encontrado. Baixando..." -ForegroundColor Yellow
    $reaUrl = "https://www.reaper.fm/reaplugs/reaplugs236_x64-install.exe"
    $reaInstaller = "$env:TEMP\reaplugs_x64.exe"
    Invoke-WebRequest -Uri $reaUrl -OutFile $reaInstaller -UseBasicParsing
    Write-Host "Instalando ReaPlugs (confirme o UAC)..." -ForegroundColor Yellow
    Start-Process -FilePath $reaInstaller -ArgumentList "/S" -Wait -Verb RunAs
    if (-not (Wait-ForFile "$ReaplugsDir\reacomp-standalone.dll" 120)) {
        throw "ReaPlugs nao foi instalado corretamente."
    }
} else {
    Write-Host "ReaPlugs ja instalado." -ForegroundColor Green
}

# 4. Permissao na pasta config do Equalizer APO
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$configDir = "$EapoDir\config"
if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir -Force | Out-Null }
icacls "$configDir" /grant "${currentUser}:F" /T /Q | Out-Null

# 5. Dependencias npm
Write-Host "Instalando dependencias do projeto..." -ForegroundColor Yellow
Set-Location $BaseDir
npm install
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao instalar dependencias npm."
}

# 6. Atalho na area de trabalho
Write-Host "Criando atalho na area de trabalho..." -ForegroundColor Yellow
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\NEXO SOUND.lnk")
$Shortcut.TargetPath = "$BaseDir\start-app.bat"
$Shortcut.WorkingDirectory = $BaseDir
$Shortcut.Description = "NEXO SOUND"
$Shortcut.Save()

Write-Host "`nSetup concluido com sucesso!" -ForegroundColor Green

if (-not $NoLaunch) {
    Write-Host "Iniciando NEXO SOUND..." -ForegroundColor Cyan
    Start-Process "$BaseDir\start-app.bat"
}
