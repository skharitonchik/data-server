const { readFileSync, readdirSync, lstatSync } = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

async function createZipArchive(globalPath, name) {
  try {
    const zip = new AdmZip();
    const outputFile = `${path.resolve(__dirname, `../../backups/${name}-${new Date().toJSON()}`)}.zip`;

    zip.addLocalFolder(path.resolve(__dirname, globalPath));

    zip.writeZip(outputFile);

    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

const getFolderFiles = (globalPath) => {
  const files = readdirSync(path.resolve(__dirname, globalPath));
  const filesToSend = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const isDir = lstatSync(path.resolve(__dirname, `${globalPath}/${file}`)).isDirectory();

    if (isDir) {
      const innerDirrFiles = readdirSync(path.resolve(__dirname, `${globalPath}/${file}`));

      filesToSend.push(...innerDirrFiles.map((f) => `${file}/${f}`));
    } else {
      filesToSend.push(file);
    }
  }

  return filesToSend;
};

const BACKUPS_FOLDER_PATH = '../../backups';
const DATA_FOLDER_PATH = '../../data';

const getBackups = (req, res) => {
  const filesToSend = getFolderFiles(BACKUPS_FOLDER_PATH);

  console.log('GET: /backups');

  res.send(filesToSend);
  res.end();
};

const createBackups = (req, res) => {
  createZipArchive(`${DATA_FOLDER_PATH}/prod`, 'prod').then(() => {
    console.log('GET: /backups');

    res.end();
  });
};

const downloadBackup = (req, res) => {
  const filename = req.params.filename;

  console.log(`DOWNLOAD: /backups/${filename}`);

  res.download(path.resolve(__dirname, `${BACKUPS_FOLDER_PATH}/${filename}`));
};

const getDataFolderFiles = (req, res) => {
  const filesToSend = getFolderFiles(DATA_FOLDER_PATH);

  console.log('GET: /data');

  res.send(filesToSend);
  res.end();
};

const openDataFolderFile = (req, res) => {
  const filename = req.params.filename;
  const fileContent = readFileSync(path.resolve(__dirname, `${DATA_FOLDER_PATH}/${filename}`));

  console.log(`GET: OPEN: /data/${filename}`);

  res.writeHeader(200, { 'Content-Type': 'application/json' });
  res.write(fileContent);
  res.end();
};

const downloadDataFolderFile = (req, res) => {
  const filename = req.params.filename;

  console.log(`DOWNLOAD: /data/${filename}`);

  res.download(path.resolve(__dirname, `${DATA_FOLDER_PATH}/${filename}`));
};

module.exports = {
  getBackups,
  createBackups,
  downloadBackup,
  getDataFolderFiles,
  openDataFolderFile,
  downloadDataFolderFile,
};
