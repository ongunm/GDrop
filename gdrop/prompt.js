const { app, BrowserWindow } = require('electron');
const prompt = require('electron-prompt');

function createPromptWindow() {
  return new Promise((resolve, reject) => {
    app.on('ready', async () => {
      const window = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });

      const refreshToken = await prompt({
        title: 'Enter Refresh Token',
        label: 'Google OAuth2 Refresh Token:',
        inputAttrs: {
          type: 'text'
        },
        type: 'input'
      }, window);

      if (refreshToken) {
        resolve(refreshToken);
      } else {
        reject(new Error('No refresh token entered'));
      }

      app.quit();
    });
  });
}

module.exports = { createPromptWindow };