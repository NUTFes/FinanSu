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
  const item = data.item;
  const price = data.price;
  const department_id = data.department_id;
  const detail = data.detail;
  const itemUrl = data.url;
  const postUrl =
    url +
    '?item="' +
    item +
    '"&price=' +
    price +
    '&department_id=' +
    department_id +
    '&detail="' +
    detail +
    '"&url="' +
    itemUrl +
    '"';
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
  const item = data.item;
  const price = data.price;
  const department_id = data.department_id;
  const detail = data.detail;
  const itemUrl = data.url;
  const putUrl =
    url +
    '?item="' +
    item +
    '"&price=' +
    price +
    '&department_id=' +
    department_id +
    '&detail="' +
    detail +
    '"&url="' +
    itemUrl +
    '"';
  console.log(putUrl, data.item, data.price, data.department_id, data.detail, data.url);
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
