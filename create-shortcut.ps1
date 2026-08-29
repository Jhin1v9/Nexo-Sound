$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut('C:\Users\Abner\Desktop\NEXO SOUND.lnk')
$Shortcut.TargetPath = 'C:\Users\Abner\volume-boost-panel\start-app.bat'
$Shortcut.WorkingDirectory = 'C:\Users\Abner\volume-boost-panel'
$Shortcut.Description = 'NEXO SOUND'
$Shortcut.Save()
