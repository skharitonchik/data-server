const ENVIRONMENT = 'prod';

const FILE_PATHS = {
  dev: {
    categories: 'categories.json',
    users: 'users.json',
    cards: 'cards.json',
    currencies: 'currencies.json',
    transactions: 'transactions.json',
    todos: 'todoLists.json',
    filters: 'filters.json',
  },
  prod: {
    categories: 'prod/categories.prod.json',
    users: 'prod/users.prod.json',
    cards: 'prod/cards.prod.json',
    currencies: 'prod/currencies.prod.json',
    transactions: 'prod/transactions.prod.json',
    todos: 'prod/todoLists.prod.json',
    filters: 'prod/filters.prod.json',
  },
};
const filePaths = FILE_PATHS[ENVIRONMENT];

module.exports = filePaths;
