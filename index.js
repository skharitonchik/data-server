const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');
const { writeFileSync, readFileSync, readdirSync, statSync } = require('fs');
const { initTodoListsRoutes } = require('./server/todo-lists/todoLists.routes');
const { initDataFoldersActions } = require('./server/data-folder/dataFolders.routes');
const { initRoutes } = require('./server/financial/financial.routes');
const path = require('path');
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(express.static('build'));
app.use(express.static('public'));
app.use(express.static('src'));

const port = 8088;
const ENVIRONMENT = 'prod';

const FILE_PATHS = {
  dev: {
    categories: 'categories.json',
    users: 'users.json',
    cards: 'cards.json',
    currencies: 'currencies.json',
    transactions: 'transactions.json',
    todos: 'todoLists.json',
  },
  prod: {
    categories: 'prod/categories.prod.json',
    users: 'prod/users.prod.json',
    cards: 'prod/cards.prod.json',
    currencies: 'prod/currencies.prod.json',
    transactions: 'prod/transactions.prod.json',
    todos: 'prod/todoLists.prod.json',
  },
};
const filePaths = FILE_PATHS[ENVIRONMENT];

initTodoListsRoutes(app, filePaths.todos);
initDataFoldersActions(app);

initRoutes(app, 'categories', filePaths.categories);
initRoutes(app, 'users', filePaths.users);
initRoutes(app, 'cards', filePaths.cards);
initRoutes(app, 'currencies', filePaths.currencies);
initRoutes(app, 'transactions', filePaths.transactions);

const read = (filePath) => {
  return readFileSync(path.resolve(__dirname, `./data/${filePath}`));
};

app.post(`/add/transaction`, (req, res) => {
  const transactionsData = JSON.parse(read(filePaths.transactions));
  const cardsData = JSON.parse(read(filePaths.cards));

  const { card, type, money, date, category, notes } = req.body;

  console.log(`POST: add transaction request`);

  if (type !== 0 && type !== 1) {
    res.send(JSON.stringify('Wrong type set, this request working only with 1 or 0'));
    return;
  }

  const savedCard = cardsData.find((c) => c.id === card);

  if (type === 1) {
    savedCard.money = (parseFloat(savedCard.money) + parseFloat(money)).toFixed(2);
  }

  if (type === 0) {
    savedCard.money = (parseFloat(savedCard.money) - parseFloat(money)).toFixed(2);

    console.info('%c  SERGEY money', 'background: #222; color: #bada55', money);
    console.info('%c  SERGEY savedCard.money', 'background: #222; color: #bada55', savedCard.money);
  }

  transactionsData.push({
    id: crypto.randomUUID(),
    date,
    card,
    category,
    money,
    type,
    notes,
  });

  try {
    writeFileSync(path.resolve(__dirname, `./data/${filePaths.cards}`), JSON.stringify(cardsData, null, 2), 'utf8');

    writeFileSync(
      path.resolve(__dirname, `./data/${filePaths.transactions}`),
      JSON.stringify(transactionsData, null, 2),
      'utf8',
    );

    console.log('Data successfully saved to disk');
    res.send(JSON.stringify('Data successfully saved to disk'));
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(JSON.stringify(`An error has occurred ${error}`));
  }
});

app.post(`/add/transaction-transfer`, (req, res) => {
  const transactionsData = JSON.parse(read(filePaths.transactions));
  const cardsData = JSON.parse(read(filePaths.cards));

  const { from, to } = req.body;

  console.log(`POST: add transaction-transfer request`);

  const fromCard = from.card;
  const fromMoney = from.money;
  const toCard = to.card;
  const toMoney = to.money;

  const savedFromCard = cardsData.find((c) => c.id === fromCard);
  const savedToCard = cardsData.find((c) => c.id === toCard);

  savedFromCard.money = (parseFloat(savedFromCard.money) - parseFloat(fromMoney)).toFixed(2);
  savedToCard.money = (parseFloat(savedToCard.money) + parseFloat(toMoney)).toFixed(2);

  transactionsData.push({
    id: crypto.randomUUID(),
    ...from,
    type: 20,
  });

  transactionsData.push({
    id: crypto.randomUUID(),
    ...to,
    type: 21,
  });

  try {
    writeFileSync(path.resolve(__dirname, `./data/${filePaths.cards}`), JSON.stringify(cardsData, null, 2), 'utf8');

    writeFileSync(
      path.resolve(__dirname, `./data/${filePaths.transactions}`),
      JSON.stringify(transactionsData, null, 2),
      'utf8',
    );

    console.log('Data successfully saved to disk');
    res.send(JSON.stringify('Data successfully saved to disk'));
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send(JSON.stringify(`An error has occurred ${error}`));
  }
});

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
