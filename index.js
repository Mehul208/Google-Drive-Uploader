const fs = require("fs");
const cron = require("node-cron");
const dotenv = require("dotenv");
const uploadFileToDrive = require("./utility");
const log4js = require("log4js");
const prompt = require("prompt-sync")({ sigint: true });

dotenv.config();

const { traceLogConfig } = require("./appSettings").log4js;
log4js.configure(traceLogConfig);
const logger = log4js.getLogger("info");

const configPath = process.env.CONFIG_FILE_PATH;
let config;
try {
    const configFile = fs.readFileSync(configPath, "utf8");
    config = JSON.parse(configFile);
} catch (err) {
    config = {
        filePath: "",
        folderId: "",
    };
}
const promptUser = async () => {
    const filePath = prompt("Please provide the file path - ");
    const folderId = prompt("Please provide folder ID from drive - ");

    if (filePath && folderId) {
        saveData(filePath, folderId);
        startProgram();
    } else {
        logger.error("No path was proveded");
        console.log("Please provide path");
    }
};

const saveData = async (filePath, folderId) => {
    fs.writeFileSync(
        configPath,
        JSON.stringify({ filePath: filePath, folderId: folderId }, null, 2),
        "utf8"
    );
    logger.info("Saved file path and folder id");
};

const startProgram = async () => {
    logger.info("Using existing configuration:");
    logger.info(`File Path: ${config.filePath}`);
    logger.info(`Folder Name: ${config.folderId}`);
    cron.schedule("57 17 * * 7", async () => {
        logger.info("Initializing Google Drive Upload");
        const res = await uploadFileToDrive(config);
        logger.debug(res.message);
    });
};

if (!config.filePath || !config.folderId) {
    promptUser();
} else startProgram();
