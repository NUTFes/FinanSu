import { Teacher } from '@type/common';

export const post = async (url: string, data: Teacher) => {
  const name = data.name;
  const position = data.position;
  const departmentID = data.departmentID;
  const room = data.room;
  const isBlack = data.isBlack;
  const remark = data.remark;
  const postUrl =
    url +
    '?name=' +
    name +
    '&position=' +
    position +
    '&department_id=' +
    departmentID +
    '&room=' +
    room +
    '&is_black=' +
    isBlack +
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

export const put = async (url: string, data: Teacher) => {
  const name = data.name;
  const position = data.position;
  const departmentID = data.departmentID;
  const room = data.room;
  const isBlack = data.isBlack;
  const remark = data.remark;
  const putUrl =
    url +
    '?name=' +
    name +
    '&position=' +
    position +
    '&department_id=' +
    departmentID +
    '&room=' +
    room +
    '&is_black=' +
    isBlack +
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
