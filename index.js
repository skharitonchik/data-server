const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');
const { writeFileSync, readFileSync, readdirSync, statSync } = require('fs');
const { getAllTodoLists } = require('./server/todo-lists/todoLists.api');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(express.static('build'));
app.use(express.static('public'));
app.use(express.static('src'));

const port = 8088;
const FILE_PATH = './data/todoLists.json';

app.get('/', (req, res) => {
  const html = readFileSync('./build/index.html');

  console.log('GET: /');

  res.writeHeader(200, { 'Content-Type': 'text/html' });
  res.write(html);
  res.end();
});
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

app.get('/data', (req, res) => {
  const files = readdirSync('./data');

  console.log('GET: /data');

  console.info('%c  SERGEY os.version()', 'background: #222; color: #bada55', os.version());
  console.info('%c  SERGEY os.os.arch()()', 'background: #222; color: #bada55', os.arch());
  console.info('%c  SERGEY os.cpus()', 'background: #222; color: #bada55', os.cpus());
  console.info('%c  SERGEY os.platform()', 'background: #222; color: #bada55', os.platform());
  console.info('%c  SERGEY os.type()', 'background: #222; color: #bada55', os.type());
  console.info('%c  SERGEY os.version()', 'background: #222; color: #bada55', os.version());
  console.info('%c  SERGEY os.totalmem()', 'background: #222; color: #bada55', os.totalmem());
  console.info('%c  SERGEY os.totalmem() converted', 'background: #222; color: #bada55', formatBytes(os.totalmem()));

  res.send(files);
});

app.get('/data/:filename', (req, res) => {
  const filename = req.params.filename;

  console.log(`DOWNLOAD: /data/${filename}`);

  res.download(`./data/${filename}`);
});
app.get('/data/open/:filename', (req, res) => {
  const filename = req.params.filename;
  const fileContent = readFileSync(`./data/${filename}`);

  console.log(`GET: OPEN: /data/${filename}`);

  res.writeHeader(200, { 'Content-Type': 'application/json' });
  res.write(fileContent);
  res.end();
});

app.get('/read', (req, res) => {
  const data = getAllTodoLists();

  console.log('GET: read request');

  res.send(data);
});

app.get('/getAllWeek', (req, res) => {
  const data = readFileSync(FILE_PATH, {});

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
    writeFileSync(FILE_PATH, JSON.stringify(clearedData, null, 2), 'utf8');
    console.log('Data successfully saved to disk');
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(`An error has occurred ${error}`);
  }

  res.send('Data written successfully to disk!');
});

app.get('/update/sort-by-done', (req, res) => {
  console.log('GET: sort todos by done status');

  const data = readFileSync(FILE_PATH, {});

  const todoGroups = JSON.parse(data);

  todoGroups.forEach((g) => {
    g.todos = [...g.todos.filter((i) => !i.isDone), ...g.todos.filter((i) => i.isDone)];
  });

  try {
    writeFileSync(FILE_PATH, JSON.stringify(todoGroups, null, 2), 'utf8');
    console.log('SORT successfully saved');
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(`An error has occurred ${error}`);
  }

  res.send('Data written successfully to disk!');
});

app.get('/update/sort-by-length', (req, res) => {
  console.log('GET: sort group by items count');

  const data = readFileSync(FILE_PATH, {});

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
    writeFileSync(FILE_PATH, JSON.stringify(todoGroups, null, 2), 'utf8');
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

  const data = readFileSync(FILE_PATH, {});

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
    writeFileSync(FILE_PATH, JSON.stringify(todoGroups, null, 2), 'utf8');
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

  const data = readFileSync(FILE_PATH, {});

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
    writeFileSync(FILE_PATH, JSON.stringify(todoGroups, null, 2), 'utf8');
    console.log('TODO successfully saved');
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(`An error has occurred ${error}`);
  }

  res.send('Data written successfully to disk!');
});

app.get('/clearDone', (req, res) => {
  console.log('GET: clear done todos');

  const data = readFileSync(FILE_PATH, {});

  let todoGroups = JSON.parse(data);

  todoGroups.forEach((g) => (g.todos = g.todos.filter((i) => !i.isDone)));

  try {
    writeFileSync(FILE_PATH, JSON.stringify(todoGroups, null, 2), 'utf8');
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
