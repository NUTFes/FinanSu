export const get = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

export const get_with_token = async (url: string, accessToken?: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access-token': accessToken ? accessToken : localStorage.getItem('access-token') || 'none',
      client: localStorage.getItem('client') || 'none',
      uid: localStorage.getItem('uid') || 'none',
    },
  });
  return await res.json();
};

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};

export const post = async (url: string, data: unknown) => {
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

export const put = async (url: string, data: unknown) => {
  const res = await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const multiDel = async (url: string, data: number[]) => {
  const res = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deleteIDs: data }),
  });
  return await res.status;
};

export const get_with_token_valid = async (url: string, accessToken?: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access-token': accessToken ? accessToken : localStorage.getItem('access-token') || 'none',
      client: localStorage.getItem('client') || 'none',
      uid: localStorage.getItem('uid') || 'none',
    },
  }).then((response) => response);
  return res.status === 200;
};
