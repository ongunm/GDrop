$scriptPath = (Get-Location).Path + "\gdrop.js"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Output "Node.js is not installed. Installing Node.js..."
    
    $nodeInstallerPath = "$env:TEMP\nodejs_installer.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/latest/node-v14.17.0-x64.msi" -OutFile $nodeInstallerPath
    Start-Process msiexec.exe -ArgumentList "/i", $nodeInstallerPath, "/quiet", "/norestart" -Wait
    Remove-Item $nodeInstallerPath
    
    $env:Path += ";C:\Program Files\nodejs"
} else {
    Write-Output "Node.js is already installed."
}

Write-Output "Installing required Node.js packages..."
npm install electron electron-prompt googleapis

$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path -Path $desktopPath -ChildPath "gdrop.lnk"

$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "npx"
$shortcut.Arguments = "electron `"$scriptPath`""
$shortcut.WorkingDirectory = (Get-Location).Path
$shortcut.WindowStyle = 1
$shortcut.Description = "Run gdrop.js with Electron"
$shortcut.Hotkey = "Ctrl+Shift+G"
$shortcut.Save()

Write-Output "Shortcut created on the Desktop with Ctrl+Shift+G as the hotkey."
Write-Output "You can now press Ctrl+Shift+G to run gdrop.js from anywhere."