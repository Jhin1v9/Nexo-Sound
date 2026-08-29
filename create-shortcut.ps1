$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut('C:\Users\Abner\Desktop\Volume Boost 500.lnk')
$Shortcut.TargetPath = 'C:\Users\Abner\volume-boost-panel\start-app.bat'
$Shortcut.WorkingDirectory = 'C:\Users\Abner\volume-boost-panel'
$Shortcut.IconLocation = 'C:\Windows\System32\SndVol.exe,0'
$Shortcut.Description = 'Volume Boost 500%'
$Shortcut.Save()
