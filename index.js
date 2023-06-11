const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

// Set the credentials and tokens
const credentials = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
};

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
);

//Set file path to upload
const filePath = "your file path";

//Set folder id (optional) from google drive folder
const folderId = "your folder id";

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

// Upload file to Google Drive
async function uploadFileToDrive() {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileName = path.basename(filePath);
    const fileMimeType = "application/octet-stream";

    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileMimeType,
                parents: folderId ? [folderId] : [],
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(filePath),
            },
        });
        console.log("File uploaded successfully. File ID:", response.data.id);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

uploadFileToDrive();

// Schedule the function to run every Monday at 9 AM
// cron.schedule("0 9 * * 1", () => {
//     console.log("Running uploadFileToDrive() at", moment().format());
//     uploadFileToDrive();
// });
