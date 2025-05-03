import { PurchaseOrder } from '@type/common';

export const post = async (url: string, data: PurchaseOrder) => {
  const deadline = data.deadline;
  const userId = data.userID;
  const financeCheck = data.financeCheck;
  const expenseId = data.expenseID;
  const postUrl =
    url +
    '?deadline=' +
    deadline +
    '&user_id=' +
    userId +
    '&finance_check=' +
    financeCheck +
    '&expense_id=' +
    expenseId;

  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const put = async (url: string, data: PurchaseOrder) => {
  const deadline = data.deadline;
  const userId = data.userID;
  const financeCheck = data.financeCheck;
  const expenseId = data.expenseID;
  const putUrl =
    url +
    '?deadline=' +
    deadline +
    '&user_id=' +
    userId +
    '&finance_check=' +
    financeCheck +
    '&expense_id=' +
    expenseId;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};
