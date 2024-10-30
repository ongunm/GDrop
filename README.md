# GDrop Setup Guide

GDrop is an AirDrop client tool designed to make it easy to send files from your iphone to your computer. By using Google Drive as a temporary storage, GDrop simplifies file transfers across platforms, allowing you to quickly transfer files shared from your iphone onto your desktop.

```bash
git clone https://github.com/ongunm/GDrop.git
cd <cloned_directory_name>
```

## How It Works

1. **Quick Sharing via Google Drive**: Google Drive is a convenient, widely available tool that serves as temporary storage for files you want to transfer. GDrop automatically creates a `GDrop` folder in your Drive after setup, where shared files from your phone will be stored temporarily.

2. **AirDrop-Like Sharing with Few Taps**: On your phone, share any file (e.g., photo, document) by selecting **Share > Google Drive**. For faster access, you can pin Google Drive to the top of your sharing options, making it nearly as quick as using AirDrop.

3. **One-Click Desktop Shortcut**: Once files are saved to the `GDrop` folder in Drive, all you need to do is click the desktop shortcut on your computer or hit the hotkey **Ctrl + Shift + G**. GDrop will automatically download the file(s) from the `GDrop` folder to your Desktop then delete them from your drive, with no need for repeated authorizations.

4. **Up-Time**: GDrop includes a wait time between after each download to check for making the Laptop be in visible state as in Airdrop, which helps save battery and prevent redundant file transfers. This way, you can simply press the shortcut when you need the shared file.

## Prerequisites

1. **Google OAuth2 API Key**:
   - You need to obtain your `client_secret.json` file, which includes the necessary credentials to access your Google Drive API.

### Steps to Obtain the OAuth2 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Enable the **Google Drive API** for your project.
4. Go to **APIs & Services** > **Credentials**.
5. Click **Create Credentials** > **OAuth client ID**.
6. Configure the OAuth consent screen if prompted.
7. Choose **Desktop app** as the application type, and download the `client_secret.json` file.
8. Place `client_secret.json` in the project folder (where `gdrop.js` is located).

## Initial Setup Instructions

### Windows Setup

1. Download and extract the project files to a preferred location.
2. Place `client_secret.json` in the project folder.
3. Run the `windows.exe` file located in `dist/windows`:
   - **Note**: The executable will automatically check if **Node.js** is installed. If not, it will download and install Node.js for you.
   - After installing Node.js, it will run `npm install` to set up the required packages (`electron` and `googleapis`).
   - A desktop shortcut (`gdrop.lnk`) will be created for you to launch `gdrop.js` easily.
4. **First-time Launch**:
   - Double-click the **GDrop** shortcut on your Desktop or use the shortcut key **Ctrl + Shift + G**.
   - Once authorized, a popup will request a **refresh token**; you only need to do this once.

### Linux Setup

1. Download and extract the project files to a preferred location.
2. Place `client_secret.json` in the project folder.
3. Open a terminal, navigate to the project directory, and run the setup script:

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   - The script will check if **Node.js** is installed. If not, it will install it.
   - Then, it will run `npm install` to set up the required packages (`electron` and `googleapis`).
   - A desktop shortcut (`gdrop.sh`) will be created on your Desktop to launch `gdrop.js`, and it can be activated by pressing **Ctrl + Shift + G**.
   - **Ctrl + Shift + G** hotkey is only set on **gnome**, **kde**, **xfce** by the setup script. If on another environment you can set a hotkey to run the command:

   ```bash
   npx electron gdrop.js
   ```

4. **First-time Launch**:
   - Double-click the **GDrop** shortcut on your Desktop or press the shortcut key **Ctrl + Shift + G**.
   - You will be prompted to authorize access. Sign in with your Google account and allow access.
   - Once authorized, a popup will request a **refresh token**; you only need to provide this token once.

## Usage

1. **On Your Phone**:

   - Open the file you want to share (e.g., photo, document).
   - Tap **Share > Google Drive** (you can pin Google Drive to the top for easier access).
   - Save the file to the `GDrop` folder.

2. **On Your Computer**:
   - Click the GDrop shortcut on your Desktop or press **Ctrl + Shift + G**.
   - GDrop will download the file from the `GDrop` folder to your Desktop.

## Summary

1. **Get `client_secret.json`** from the Google Cloud Console.
2. Place it in the project directory.
3. Run `windows.exe` (Windows) or `setup.sh` (Linux/macOS) to set up.
4. Launch the application via the desktop shortcut or **Ctrl + Shift + G**.
5. Authenticate and enter the refresh token only once on the first launch.

GDrop makes it easy to transfer files from your phone to your computer with just a few taps.
