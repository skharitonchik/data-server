const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

const saveDataToFile = (data, filePath, res) => {
  try {
    writeFileSync(path.resolve(__dirname, `${filePath}`), JSON.stringify(data, null, 2), 'utf8');
    console.log('Data successfully saved to disk');
    res.send(JSON.stringify('Data successfully saved to disk'));
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(JSON.stringify(`An error has occurred ${error}`));
  }
};

const addRow = (res, rowData, filePath) => {
  const data = JSON.parse(readFileSync(path.resolve(__dirname, `${filePath}`)));

  data.push({
    id: crypto.randomUUID(),
    ...rowData,
  });

  saveDataToFile(data, filePath, res);
};

const initFiltersRoutes = (app, storagePath) => {
  app.post('/add-filter-group', (req, res) => {
    const newRow = req.body;

    console.info('%c  SERGEY newRow', 'background: #222; color: #bada55', newRow);

    console.log(`POST: add filter request`);

    addRow(res, newRow, storagePath);
  });

  app.get('/get-filters', (req, res) => {
    const data = readFileSync(path.resolve(__dirname, `${storagePath}`));

    console.log(`GET: read filters request`);

    res.send(data);
    res.end();
  });

  app.put('/update-filter', (req, res) => {
    const data = JSON.parse(readFileSync(path.resolve(__dirname, `${storagePath}`)));

    const filterToUpdate = req.body;

    console.info('%c  SERGEY filterToUpdate', 'background: #222; color: #bada55', filterToUpdate);

    const newData = data.map((f) => {
      if (f.id === filterToUpdate.id) {
        return {
          ...filterToUpdate,
        };
      }
      return f;
    });

    console.log(`PUT: update filters request`);

    console.info('%c  SERGEY newData', 'background: #222; color: #bada55', newData);
    saveDataToFile(newData, storagePath, res);
  });
};

exports.initFiltersRoutes = initFiltersRoutes;
