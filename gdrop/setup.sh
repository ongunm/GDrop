
SCRIPT_PATH="$(pwd)/gdrop.js"

if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    echo "Node.js and npm are required. Installing them now..."
    sudo apt update
    sudo apt install -y nodejs npm
else
    echo "Node.js and npm are already installed."
fi

echo "Installing required Node.js packages..."
npm install electron electron-prompt googleapis

DESKTOP_ENVIRONMENT=$(echo "$XDG_CURRENT_DESKTOP" | tr '[:upper:]' '[:lower:]')

echo "Setting up keyboard shortcut for gdrop.js..."

if [[ $DESKTOP_ENVIRONMENT == *"gnome"* ]]; then
    echo "Detected GNOME desktop environment."

    SHORTCUT_NAME="gdrop"
    gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings \
      "$(gsettings get org.gnome.settings-daemon.plugins.media-keys custom-keybindings | sed -e "s/]$/, '\/org\/gnome\/settings-daemon\/plugins\/media-keys\/custom-keybindings\/$SHORTCUT_NAME\/']/")"
    
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/$SHORTCUT_NAME/ name "$SHORTCUT_NAME"
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/$SHORTCUT_NAME/ command "npx electron $SCRIPT_PATH"
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/$SHORTCUT_NAME/ binding "<Primary><Shift>g"
    echo "Shortcut set for GNOME: Ctrl + Shift + G to run gdrop.js"

elif [[ $DESKTOP_ENVIRONMENT == *"kde"* ]]; then
    echo "Detected KDE desktop environment."

    KDE_SHORTCUT_FILE="$HOME/.config/kglobalshortcutsrc"
    KDE_SHORTCUT_NAME="gdrop"

    echo "[$KDE_SHORTCUT_NAME]" >> "$KDE_SHORTCUT_FILE"
    echo "_launch=Ctrl+Shift+G,none,Run gdrop script" >> "$KDE_SHORTCUT_FILE"
    echo "Exec=npx electron $SCRIPT_PATH" >> "$KDE_SHORTCUT_FILE"

    echo "Shortcut set for KDE: Ctrl + Shift + G to run gdrop.js. You may need to restart your session for changes to take effect."

elif [[ $DESKTOP_ENVIRONMENT == *"xfce"* ]]; then
    echo "Detected Xfce desktop environment."

    xfconf-query -c xfce4-keyboard-shortcuts -p "/commands/custom/<Primary><Shift>g" -n -t string -s "npx electron $SCRIPT_PATH"
    echo "Shortcut set for Xfce: Ctrl + Shift + G to run gdrop.js"

else
    echo "Could not automatically set up the shortcut for your desktop environment."
    echo "Please manually create a shortcut with the following command: npx electron $SCRIPT_PATH"
fi