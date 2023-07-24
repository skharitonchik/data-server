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

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const initDataFoldersActions = (app) => {
  app.get('/file/open/:filename', (req, res) => {
    const filename = req.params.filename;
    const fileContent = readFileSync(path.resolve(__dirname, `../../data/${filename}`));

    console.log(`GET: OPEN: /data/${filename}`);

    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.write(fileContent);
    res.end();
  });

  app.get('/data', (req, res) => {
    const filesToSend = getFolderFiles('../../data');

    console.log('GET: /data');

    res.send(filesToSend);
    res.end();
  });

  app.get('/backups', (req, res) => {
    const filesToSend = getFolderFiles('../../backups');

    console.log('GET: /backups');

    res.send(filesToSend);
    res.end();
  });

  app.get('/backups-create', (req, res) => {
    createZipArchive('../../data/prod', 'prod').then(() => {
      console.log('GET: /backups');

      res.end();
    });
  });

  app.get('/file/download/:filename', (req, res) => {
    const filename = req.params.filename;

    console.log(`DOWNLOAD: /data/${filename}`);

    res.download(path.basename(`./data/${filename}`));
    res.end();
  });
};

exports.initDataFoldersActions = initDataFoldersActions;
