import os
import subprocess
import urllib.request
import shutil
from pathlib import Path
import win32com.client 

script_path = os.path.join(os.getcwd(), "gdrop.js")

def is_node_installed():
    try:
        subprocess.check_output(["node", "-v"])
        print("Node.js is already installed.")
        return True
    except FileNotFoundError:
        return False

def install_node():
    print("Node.js is not installed. Installing Node.js...")
    node_installer_url = "https://nodejs.org/dist/latest/node-v14.17.0-x64.msi"
    installer_path = os.path.join(os.getenv("TEMP"), "nodejs_installer.msi")
    urllib.request.urlretrieve(node_installer_url, installer_path)
    subprocess.run(["msiexec", "/i", installer_path, "/quiet", "/norestart"], check=True)
    os.remove(installer_path)
    print("Node.js installation completed.")

def add_node_to_path():
    node_path = Path("C:/Program Files/nodejs")
    if node_path.exists():
        os.environ["PATH"] += os.pathsep + str(node_path)

def install_node_packages():
    print("Installing required Node.js packages...")
    subprocess.run(["npm", "install", "electron", "electron-prompt", "googleapis"], check=True)
    print("Node.js packages installed successfully.")

def create_desktop_shortcut():
    desktop_path = Path.home() / "Desktop"
    shortcut_path = desktop_path / "gdrop.lnk"
    shell = win32com.client.Dispatch("WScript.Shell")
    shortcut = shell.CreateShortcut(str(shortcut_path))
    shortcut.TargetPath = "npx"
    shortcut.Arguments = f'electron "{script_path}"'
    shortcut.WorkingDirectory = os.getcwd()
    shortcut.WindowStyle = 1
    shortcut.Description = "Run gdrop.js with Electron"
    shortcut.Hotkey = "Ctrl+Shift+G"
    shortcut.save()
    print("Shortcut created on the Desktop with Ctrl+Shift+G as the hotkey.")

if not is_node_installed():
    install_node()
    add_node_to_path()

install_node_packages()
create_desktop_shortcut()
print("Setup completed. You can now press Ctrl+Shift+G to run gdrop.js from anywhere.")