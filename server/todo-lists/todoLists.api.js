const { writeFileSync, readFileSync, readdirSync, statSync } = require('fs');

const getAllTodoLists = (filePath) => {
  return readFileSync(filePath, {});
};

exports.getAllTodoLists = getAllTodoLists;
