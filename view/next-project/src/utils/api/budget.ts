import { Budget, Expense } from '@type/common';

export const post = async (url: string, data: Budget) => {
  const price = data.price;
  const yearID = data.yearID;
  const sourceID = data.sourceID;
  const postUrl = url + '?price=' + price + '&year_id=' + yearID + '&source_id=' + sourceID;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const postExpenses = async (url: string, data: Expense) => {
  const name = data.name;
  const yearID = data.yearID;
  const postUrl = url + '?name=' + name + '&year_id=' + yearID;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const put = async (url: string, data: Budget) => {
  const price = data.price;
  const yearID = data.yearID;
  const sourceID = data.sourceID;
  const putUrl = url + '?price=' + price + '&year_id=' + yearID + '&source_id=' + sourceID;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const expensePut = async (url: string, data: Expense) => {
  const name = data.name;
  const totalPrice = data.totalPrice;
  const yearID = data.yearID;
  const putUrl = url + '?name=' + name + '&total_price=' + totalPrice + '&year_id=' + yearID;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// dataはExpenseからtotalPriceを削除したもの
export const expensePost = async (url: string, data: Omit<Expense, 'totalPrice'>) => {
  const name = data.name;
  const yearID = data.yearID;
  const postUrl = url + '?name=' + name + '&year_id=' + yearID;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};
