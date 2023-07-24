const { readFileSync, readdirSync } = require('fs');
const path = require('path');

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const initDataFoldersActions = (app) => {
  app.get('/data/open/:filename', (req, res) => {
    const filename = req.params.filename;
    const fileContent = readFileSync(path.resolve(__dirname, `../../data/${filename}`));

    console.log(`GET: OPEN: /data/${filename}`);

    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.write(fileContent);
    res.end();
  });

  app.get('/data', (req, res) => {
    const files = readdirSync(path.resolve(__dirname, '../../data'));

    console.log(path.basename(' ./data'));
    console.log(__dirname, 'dirname');
    console.log(path.resolve(__dirname, '../../data'), 'resolve');
    console.log('GET: /data');

    // console.info('%c  SERGEY os.version()', 'background: #222; color: #bada55', os.version());
    // console.info('%c  SERGEY os.os.arch()()', 'background: #222; color: #bada55', os.arch());
    // console.info('%c  SERGEY os.cpus()', 'background: #222; color: #bada55', os.cpus());
    // console.info('%c  SERGEY os.platform()', 'background: #222; color: #bada55', os.platform());
    // console.info('%c  SERGEY os.type()', 'background: #222; color: #bada55', os.type());
    // console.info('%c  SERGEY os.version()', 'background: #222; color: #bada55', os.version());
    // console.info('%c  SERGEY os.totalmem()', 'background: #222; color: #bada55', os.totalmem());
    // console.info('%c  SERGEY os.totalmem() converted', 'background: #222; color: #bada55', formatBytes(os.totalmem()));

    res.send(files);
    res.end();
  });

  app.get('/data/download/:filename', (req, res) => {
    const filename = req.params.filename;

    console.log(`DOWNLOAD: /data/${filename}`);

    res.download(path.basename(`./data/${filename}`));
    res.end();
  });
};

exports.initDataFoldersActions = initDataFoldersActions;
