@echo off
echo ========================================
echo   Volume Boost 500%% - Setup Wizard
echo ========================================
echo.
echo Solicitando permissao de administrador...
powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"C:\Users\Abner\volume-boost-panel\setup.ps1\"' -Verb runAs"
