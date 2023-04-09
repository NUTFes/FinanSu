import { PurchaseItem } from '@type/common';

export const post = async (url: string, data: PurchaseItem) => {
  const item: string = data.item;
  const price: number = data.price;
  const quantity: number = data.quantity;
  const detail: string = data.detail;
  const itemUrl: string = data.url;
  const purchaseOrderId: number = data.purchaseOrderID;
  const financeCheck: boolean = data.financeCheck;
  const postUrl =
    url +
    '?item=' +
    item +
    '&price=' +
    price +
    '&quantity=' +
    quantity +
    '&detail=' +
    detail +
    '&url=' +
    itemUrl +
    '&purchase_order_id=' +
    purchaseOrderId +
    '&finance_check=' +
    financeCheck;
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

export const put = async (url: string, data: PurchaseItem) => {
  const item: string = data.item;
  const price: number = data.price;
  const quantity: number = data.quantity;
  const detail: string = data.detail;
  const itemUrl: string = data.url;
  const purchaseOrderId: number = data.purchaseOrderID;
  const financeCheck: boolean = data.financeCheck;
  const putUrl =
    url +
    '?item=' +
    item +
    '&price=' +
    price +
    '&quantity=' +
    quantity +
    '&detail=' +
    detail +
    '&url=' +
    itemUrl +
    '&purchase_order_id=' +
    purchaseOrderId +
    '&finance_check=' +
    financeCheck;
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
