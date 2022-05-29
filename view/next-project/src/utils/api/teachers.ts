export const post = async (url: string, data: any) => {
  const name = data.name;
  const position = data.position;
  const department_id = data.department_id;
  const room = data.room;
  const is_black = data.is_black;
  const remark = data.remark;
  const postUrl =
    url +
    '?name=' +
    name +
    '&position=' +
    position +
    '&department_id=' +
    department_id +
    '&room=' +
    room +
    '&is_black=' +
    is_black +
    '&remark=' +
    remark;
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
  const name = data.name;
  const position = data.position;
  const department_id = data.department_id;
  const room = data.room;
  const is_black = data.is_black;
  const remark = data.remark;
  const putUrl =
    url +
    '?name=' +
    name +
    '&position=' +
    position +
    '&department_id=' +
    department_id +
    '&room=' +
    room +
    '&is_black=' +
    is_black +
    '&remark=' +
    remark;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res;
};

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};
