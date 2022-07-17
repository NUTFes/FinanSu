export const get = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

export const get_with_token = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token') || 'none',
      client: localStorage.getItem('client') || 'none',
      uid: localStorage.getItem('uid') || 'none',
    },
  });
  return await res.json();
};

export const post = async (url: string, data: any, purchase_order_id: number) => {
  const item = data.item;
  const price = data.price;
  const quantity = data.quantity;
  const detail = data.detail;
  const itemUrl = data.url;
  const purchaseOrderId = purchase_order_id;
  const finance_check = data.finance_check;
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
    finance_check;
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

export const put = async (url: string, data: any, purchase_order_id: number) => {
  const item = data.item;
  const price = data.price;
  const quantity = data.quantity;
  const detail = data.detail;
  const itemUrl = data.url;
  const purchaseOrderId = purchase_order_id;
  const finance_check = data.finance_check;
  const putUrl =
    url +
    '?item="' +
    item +
    '"&price=' +
    price +
    '&quantity=' +
    quantity +
    '&detail="' +
    detail +
    '"&url="' +
    itemUrl +
    '&purchase_order_id=' +
    purchaseOrderId +
    '&finance_check=' +
    finance_check;
  // console.log(putUrl, data.item, data.price, data.quantity, data.detail, data.url);
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

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};
