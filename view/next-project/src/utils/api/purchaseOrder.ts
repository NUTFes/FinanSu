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
  const deadline = data.deadline;
  const userId = data.user_id;
  const financeCheck = data.finance_check;
  const postUrl =
    url + '?deadline=' + deadline + '&user_id=' + userId + '&finance_check=' + financeCheck;

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

export const put = async (url: string, data: any) => {
  const deadline = data.deadline;
  const userId = data.user_id;
  const financeCheck = data.finance_check;
  const putUrl =
    url + '?deadline=' + deadline + '&user_id=' + userId + '&finance_check=' + financeCheck;
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

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};
