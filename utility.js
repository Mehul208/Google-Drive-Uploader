const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const log4js = require("log4js");
dotenv.config();

const { traceLogConfig } = require("./appSettings").log4js;
log4js.configure(traceLogConfig);
const logger = log4js.getLogger("trace");

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

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

async function uploadFileToDrive({ filePath, folderId }) {
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
        logger.info("File uploaded successfully. File ID:", response.data.id);
        return { message: "Uploded successfully" };
    } catch (error) {
        logger.error("Error uploading file:", error);
        return { message: "Got Error while uploading, contact developer" };
    }
}

module.exports = uploadFileToDrive;
