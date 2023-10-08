const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readFileSync } = require('fs');

const envs = require('./server/config/envs.js');
const cardsRouter = require('./server/routers/cards.router');
const transactionsRouter = require('./server/routers/transactions.router');
const filtersRouter = require('./server/routers/filters.router');
const usersRouter = require('./server/routers/users.router');
const currenciesRouter = require('./server/routers/currencies.router');
const categoriesRouter = require('./server/routers/categories.router');
const dataFolderRouter = require('./server/routers/data-files.router');

const { initTodoListsRoutes } = require('./server/todo-lists/todoLists.routes');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(express.static('build'));
app.use(express.static('public'));
app.use(express.static('src'));

app.use('/api', cardsRouter);
app.use('/api', transactionsRouter);
app.use('/api', filtersRouter);
app.use('/api', usersRouter);
app.use('/api', currenciesRouter);
app.use('/api', categoriesRouter);
app.use('/api', dataFolderRouter);

const port = 8088;

initTodoListsRoutes(app, envs.todos);

app.get('/', (req, res) => {
  const html = readFileSync('./build/index.html');

  console.log('GET: /');

  res.writeHeader(200, { 'Content-Type': 'text/html' });
  res.write(html);
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
