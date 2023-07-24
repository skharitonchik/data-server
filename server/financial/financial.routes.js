const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

const FILE_PATH = './data/todoLists.json';
//сохранять курсы валют на день транзакции

const read = (filePath) => {
  return readFileSync(path.resolve(__dirname, `../../data/${filePath}`));
};
const update = (row, filePath) => {};
const deleteRow = (row, filePath) => {};
const addRow = (row, filePath) => {};

const initRoutes = (app, name, storagePath) => {
  app.get(`/read/${name}`, (req, res) => {
    const data = read(storagePath);

    console.log(`GET: read ${name} request`);

    res.send(data);
  });

  app.put(`/update/${name}`, (req, res) => {
    const data = JSON.parse(read(storagePath));

    const { id } = req.body;

    console.info('%c  SERGEY id', 'background: #222; color: #bada55', id);

    let dataToEdit = data.find((i) => i.id === id);

    console.log(`UPDATE: update ${name} request`);

    if (dataToEdit) {
      dataToEdit = {
        id,
        ...req.body,
      };

      const newData = data.map((d) => {
        if (d.id === id) {
          return dataToEdit;
        }

        return d;
      });

      try {
        writeFileSync(path.resolve(__dirname, `../../data/${storagePath}`), JSON.stringify(newData, null, 2), 'utf8');
        console.log('Data successfully saved to disk');
        res.send(JSON.stringify('Data successfully saved to disk'));
      } catch (error) {
        console.log('An error has occurred ', error);
        res.send(JSON.stringify(`An error has occurred ${error}`));
      }

      console.info('%c  SERGEY dataToEdit', 'background: #222; color: #bada55', dataToEdit);
      console.info('%c  SERGEY data', 'background: #222; color: #bada55', newData);
    }
  });
  app.delete(`/delete/${name}`, (req, res) => {
    const data = JSON.parse(read(storagePath));

    const { id } = req.body;

    console.info('%c  SERGEY id', 'background: #222; color: #bada55', id);
    const newData = data.filter((i) => i.id !== id);

    console.log(`DELETE: delete ${name} request`);

    try {
      writeFileSync(path.resolve(__dirname, `../../data/${storagePath}`), JSON.stringify(newData, null, 2), 'utf8');
      console.log('Data successfully saved to disk');
      res.send(JSON.stringify('Data successfully saved to disk'));
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(JSON.stringify(`An error has occurred ${error}`));
    }
  });
  app.post(`/add/${name}`, (req, res) => {
    const data = JSON.parse(read(storagePath));

    const newRow = req.body;

    console.info('%c  SERGEY data', 'background: #222; color: #bada55', data);

    data.push({
      id: crypto.randomUUID(),
      ...newRow,
    });

    console.log(`POST: add ${name} request`);

    try {
      writeFileSync(path.resolve(__dirname, `../../data/${storagePath}`), JSON.stringify(data, null, 2), 'utf8');
      console.log('Data successfully saved to disk');
      res.send(JSON.stringify('Data successfully saved to disk'));
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(JSON.stringify(`An error has occurred ${error}`));
    }
  });
};

exports.initRoutes = initRoutes;
