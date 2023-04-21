const {writeFileSync, readFileSync, readdirSync, statSync} = require('fs');

const FILE_PATH = "./data/todoLists.json"


const getAllTodoLists = () => {
    return readFileSync(FILE_PATH, {});
}

exports.getAllTodoLists = getAllTodoLists;