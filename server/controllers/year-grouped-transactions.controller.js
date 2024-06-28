exports.processTransactions = (transactions, categories, cards) => {
  const yearlyData = {};
  const categoryMap = categories.reduce((map, category) => {
    map[category.id] = category.name;
    return map;
  }, {});
  const cardCurrencyMap = cards.reduce((map, card) => {
    map[card.id] = card.currency;
    return map;
  }, {});

  // Преобразование дат и суммирование по годам, месяцам, категориям и валютам
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const year = date.getUTCFullYear();
    const month = `${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    const cardId = transaction.card;
    const currency = cardCurrencyMap[cardId] || 'Unknown';
    const categoryId = transaction.category;
    const categoryName = categoryMap[categoryId] || 'Unknown';
    const amount = transaction.money;

    if (!yearlyData[year]) {
      yearlyData[year] = {};
    }

    if (!yearlyData[year][month]) {
      yearlyData[year][month] = {};
    }

    if (!yearlyData[year][month][categoryName]) {
      yearlyData[year][month][categoryName] = { currencies: {} };
    }

    if (!yearlyData[year][month][categoryName].currencies[currency]) {
      yearlyData[year][month][categoryName].currencies[currency] = { income: 0, expense: 0 };
    }

    if (transaction.type === 0) {
      yearlyData[year][month][categoryName].currencies[currency].expense += amount;
    } else if (transaction.type === 1) {
      yearlyData[year][month][categoryName].currencies[currency].income += amount;
    }
  });

  return yearlyData;
};
