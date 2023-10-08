const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
class CommonController {
  filePath = '';
  baseName = '';
  constructor(storagePath, baseName) {
    this.filePath = path.resolve(__dirname, `../../data/${storagePath}`);
    this.baseName = baseName;
  }

  readData() {
    return JSON.parse(readFileSync(this.filePath));
  }

  updateData(data, res) {
    try {
      const successMsg = `${this.baseName} Data successfully saved to disk`;

      writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');

      console.log(successMsg);

      res && res.send(JSON.stringify(successMsg));
    } catch (error) {
      const errorMsg = `${this.baseName} An error has occurred ${error}`;

      console.log(errorMsg);

      res && res.send(JSON.stringify(errorMsg));
    }
  }

  getAll(req, res) {
    const data = this.readData();

    console.log(`GET: ${this.baseName} ALL common request`);

    res.send(data);
    res.end();
  }

  putData(req, res) {
    const data = this.readData();

    const { id } = req.body;

    let dataToEdit = data.find((i) => i.id === id);

    console.log(`UPDATE: ${this.baseName} ALL common request`);

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

      this.updateData(newData, res);
    }
  }

  postData(req, res) {
    const data = this.readData();

    const newRow = req.body;

    data.push({
      id: crypto.randomUUID(),
      ...newRow,
    });

    console.log(`POST: ${this.baseName} ADD ALL common request`);

    this.updateData(data, res);
  }

  deleteData(req, res) {
    const data = this.readData();
    const { id } = req.body;
    const newData = data.filter((i) => i.id !== id);

    console.log(`DELETE: ${this.baseName} ALL common request`);

    this.updateData(newData, res);
  }
}

module.exports = CommonController;
