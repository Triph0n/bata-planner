
$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Bata Planner.lnk")
$Shortcut.TargetPath = "C:\Users\Vladimir\.gemini\antigravity\scratch\bata-planner\launch.bat"
$Shortcut.WorkingDirectory = "C:\Users\Vladimir\.gemini\antigravity\scratch\bata-planner"
$Shortcut.IconLocation = "C:\Users\Vladimir\.gemini\antigravity\scratch\bata-planner\bata_planner.ico"
$Shortcut.Save()
