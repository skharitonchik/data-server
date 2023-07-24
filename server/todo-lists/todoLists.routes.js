const { getAllTodoLists } = require('./todoLists.api');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const initTodoListsRoutes = (app, filePath) => {
  const baseFilePath = path.resolve(__dirname, '../../data');

  app.get('/read', (req, res) => {
    const data = getAllTodoLists(`${baseFilePath}/${filePath}`);

    console.log('GET: read request');

    res.send(data);
  });

  app.get('/getAllWeek', (req, res) => {
    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    console.log('GET: getAllWeek request');

    const todoGroups = JSON.parse(data);

    let weekTodos = [];

    todoGroups.forEach((g) => {
      weekTodos = [
        ...weekTodos,
        ...g.todos.filter((i) => {
          if (i.isWeekTodo) {
            i.groupTitle = g.groupTitle;
          }

          return i.isWeekTodo;
        }),
      ];
    });

    res.send(weekTodos);
  });

  app.post('/update', (req, res) => {
    console.log('POST: update request');

    const clearedData = clearData(req.body);

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(clearedData, null, 2), 'utf8');
      console.log('Data successfully saved to disk');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  app.get('/update/sort-by-done', (req, res) => {
    console.log('GET: sort todos by done status');

    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    const todoGroups = JSON.parse(data);

    todoGroups.forEach((g) => {
      g.todos = [...g.todos.filter((i) => !i.isDone), ...g.todos.filter((i) => i.isDone)];
    });

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(todoGroups, null, 2), 'utf8');
      console.log('SORT successfully saved');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  app.get('/update/sort-by-length', (req, res) => {
    console.log('GET: sort group by items count');

    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    let todoGroups = JSON.parse(data);

    todoGroups = todoGroups.sort((a, b) => {
      if (a.todos.length < b.todos.length) {
        return 1;
      }

      if (a.todos.length > b.todos.length) {
        return -1;
      }

      return 0;
    });

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(todoGroups, null, 2), 'utf8');
      console.log('SORT successfully saved');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  app.post('/update/todo-done', (req, res) => {
    console.log('POST: update todo request');

    const { todoTitle, groupTitle, isDone } = req.body;

    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    const todoGroups = JSON.parse(data);

    todoGroups.forEach((g) => {
      if (g.groupTitle === groupTitle) {
        g.todos.forEach((t) => {
          if (t.title === todoTitle) {
            t.isDone = isDone;
          }
        });
      }
    });

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(todoGroups, null, 2), 'utf8');
      console.log('TODO successfully saved');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  app.post('/update/todo-week', (req, res) => {
    console.log('POST: update todo week request');

    const { todoTitle, groupTitle, weekNumber, weekDay, isDone } = req.body;

    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    const todoGroups = JSON.parse(data);

    todoGroups.forEach((g) => {
      if (g.groupTitle === groupTitle) {
        g.todos.forEach((t) => {
          if (t.title === todoTitle) {
            t.weekNumber = weekNumber;
            t.weekDay = weekDay;
            t.isDone = isDone;
          }
        });
      }
    });

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(todoGroups, null, 2), 'utf8');
      console.log('TODO successfully saved');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  app.get('/clearDone', (req, res) => {
    console.log('GET: clear done todos');

    const data = readFileSync(`${baseFilePath}/${filePath}`, {});

    let todoGroups = JSON.parse(data);

    todoGroups.forEach((g) => (g.todos = g.todos.filter((i) => !i.isDone)));

    try {
      writeFileSync(`${baseFilePath}/${filePath}`, JSON.stringify(todoGroups, null, 2), 'utf8');
      console.log('CLEAR DONE successfully saved');
    } catch (error) {
      console.log('An error has occurred ', error);
      res.send(`An error has occurred ${error}`);
    }

    res.send('Data written successfully to disk!');
  });

  const clearData = (todoGroups) => {
    return todoGroups.map((g) => {
      delete g.newTodoTitle;
      delete g.isNewAdding;
      delete g.isListOpen;

      return g;
    });
  };
};

exports.initTodoListsRoutes = initTodoListsRoutes;
