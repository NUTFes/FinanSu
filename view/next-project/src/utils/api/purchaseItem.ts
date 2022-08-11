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

export const post = async (url: string, data: any) => {
  const item: String = data.item;
  const price: number = data.price;
  const quantity: number = data.quantity;
  const detail: String = data.detail;
  const itemUrl:String = data.url;
  const purchaseOrderId: number = data.purchase_order_id;
  const finance_check: boolean = data.finance_check;
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
  }).then(response => response.json());
  return res;
};

export const put = async (url: string, data: any) => {
  const item: String = data.item;
  const price: number = data.price;
  const quantity: number = data.quantity;
  const detail: String = data.detail;
  const itemUrl:String = data.url;
  const purchaseOrderId: number = data.purchase_order_id;
  const finance_check: boolean = data.finance_check;
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
    finance_check;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
  return res;
};

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};
