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
  const user_id = data.user_id;
  const discount = data.discount;
  const addition = data.addition;
  const financeCheck = data.finance_check;
  const remark = data.remark;
  const purchaseOrderId = data.purchase_order_id;
  const postUrl =
    url +
    '?user_id=' +
    user_id +
    '&discount=' +
    discount +
    '&addition=' +
    addition +
    '&finance_check=' +
    financeCheck +
    '&remark=' +
    remark +
    '&purchase_order_id=' +
    purchaseOrderId;
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

export const put = async (url: string, data: any) => {
  const user_id = data.user_id;
  const discount = data.discount;
  const addition = data.addition;
  const financeCheck = data.finance_check;
  const remark = data.remark;
  const purchaseOrderId = data.purchase_order_id;
  const putUrl =
    url +
    '?user_id=' +
    user_id +
    '&discount=' +
    discount +
    '&addition=' +
    addition +
    '&finance_check=' +
    financeCheck +
    '&remark=' +
    remark +
    '&purchase_order_id=' +
    purchaseOrderId;
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
