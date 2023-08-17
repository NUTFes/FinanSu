import { PurchaseReport } from '@type/common';

export const post = async (url: string, data: PurchaseReport) => {
  console.log(data);
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const put = async (url: string, data: PurchaseReport) => {
  const userID = data.userID;
  const discount = data.discount;
  const addition = data.addition;
  const financeCheck = data.financeCheck;
  const remark = data.remark;
  const buyer = data.buyer;
  const purchaseOrderId = data.purchaseOrderID;
  const putUrl =
    url +
    '?user_id=' +
    userID +
    '&discount=' +
    discount +
    '&addition=' +
    addition +
    '&finance_check=' +
    financeCheck +
    '&remark=' +
    remark +
    '&buyer=' +
    buyer +
    '&purchase_order_id=' +
    purchaseOrderId;
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
