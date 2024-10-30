const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const os = require('os');
const { createPromptWindow } = require('./prompt');

const files = fs.readdirSync(__dirname);
const jsonFile = files.find(file => file.startsWith('client_secret') && file.endsWith('.json'));

if (!jsonFile) {
  throw new Error('client_secret JSON file not found in the current directory');
}

const jsonPath = path.join(__dirname, jsonFile);
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const CLIENT_ID = jsonData.web.client_id;
const CLIENT_SECRET = jsonData.web.client_secret;
const REDIRECT_URI = jsonData.web.redirect_uris[0];
let REFRESH_TOKEN = jsonData.web.refresh_token;

async function getRefreshToken() {
  if (!REFRESH_TOKEN) {
    console.log('Refresh token is missing. Please enter it in the prompt window.');
    REFRESH_TOKEN = await createPromptWindow();
    jsonData.web.refresh_token = REFRESH_TOKEN;
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2)); // Save to JSON file
    console.log('Refresh token saved to JSON file.');
  }
}

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

(async function() {
  await getRefreshToken();
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  main().catch(console.error);
})();

// oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function createFolderIfNotExists() {
  try {
    const response = await drive.files.list({
      q: "name='gdrop' and mimeType='application/vnd.google-apps.folder'",
      fields: 'files(id, name)',
    });

    if (response.data.files.length > 0) {
      console.log('Folder "gdrop" already exists with ID:', response.data.files[0].id);
      return response.data.files[0].id;
    }

    const fileMetadata = {
      name: 'gdrop',
      mimeType: 'application/vnd.google-apps.folder',
    };

    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    console.log('Folder "gdrop" created with ID:', folder.data.id);
    return folder.data.id;
  } catch (error) {
    console.error('Error creating folder:', error.message);
    throw error;
  }
}

async function downloadAndDeleteFiles(folderId) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name)',
    });

    const files = response.data.files;

    if (files.length === 0) {
      return false;
    }

    const desktopPath = path.join(os.homedir(), 'Desktop');

    for (const file of files) {
      const fileId = file.id;
      const destPath = path.join(desktopPath, file.name);
      const dest = fs.createWriteStream(destPath);

      // Download file
      await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' },
        (err, res) => {
          if (err) throw new Error(`Error downloading file: ${err.message}`);
          res.data.pipe(dest);
        }
      );

      await new Promise(resolve => dest.on('finish', resolve));
      console.log(`Downloaded file ${file.name} to ${desktopPath}`);

      // Delete file from Google Drive
      await drive.files.delete({ fileId });
      console.log(`Deleted file ${file.name} from Google Drive`);
    }
    return true;
  } catch (error) {
    console.error('Error in download and delete process:', error.message);
    throw error;
  }
}

async function repeatedlyCheckForFiles(folderId) {
  const startTime = Date.now();
  const timeLimit = 90 * 1000; 

  while (Date.now() - startTime < timeLimit) {
    const filesExist = await downloadAndDeleteFiles(folderId);
    if (filesExist) {
      console.log('Files found and downloaded. Restarting 1.5-minute timer for new files.');
      return true; 
    }
    
    console.log('No files found. Checking again in a few seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('No new files found after waiting. Exiting program.');
  return false;
}

async function main() {
  const folderId = await createFolderIfNotExists();

  while (true) {
    const filesDetected = await repeatedlyCheckForFiles(folderId);
    if (!filesDetected) break; 
  }
}

main().catch(console.error);