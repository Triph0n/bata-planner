from PIL import Image
import os
import subprocess

# Convert Image
png_path = r"C:\Users\Vladimir\.gemini\antigravity\brain\eb22eba7-f6ba-4d72-9451-d8e7b912cbf2\bata_planner_icon_1777236752530.png"
ico_path = r"C:\Users\Vladimir\.gemini\antigravity\scratch\bata-planner\bata_planner.ico"

img = Image.open(png_path)
icon_sizes = [(16,16), (32, 32), (48, 48), (64,64), (128, 128), (256, 256)]
img.save(ico_path, sizes=icon_sizes)
print("Icon saved successfully.")

# Create shortcut
ps_script = f"""
$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\\Bata Planner.lnk")
$Shortcut.TargetPath = "C:\\Users\\Vladimir\\.gemini\\antigravity\\scratch\\bata-planner\\launch.bat"
$Shortcut.WorkingDirectory = "C:\\Users\\Vladimir\\.gemini\\antigravity\\scratch\\bata-planner"
$Shortcut.IconLocation = "{ico_path}"
$Shortcut.Save()
"""

ps_path = r"C:\Users\Vladimir\.gemini\antigravity\scratch\bata-planner\create_shortcut.ps1"
with open(ps_path, "w") as f:
    f.write(ps_script)

subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_path])
print("Shortcut created successfully.")
