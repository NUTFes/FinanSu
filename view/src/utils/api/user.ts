import { User } from '@type/common';

export const post = async (url: string, data: User) => {
  const name = data.name;
  const bureauID = data.bureauID;
  const roleID = data.roleID;
  const postUrl = url + '?name=' + name + '&bureau_id=' + bureauID + '&role_id=' + roleID;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res;
  // return await res.json();
};

export const put = async (url: string, data: User) => {
  const name = data.name;
  const bureauID = data.bureauID;
  const roleID = data.roleID;
  const putUrl = url + '?name=' + name + '&bureau_id=' + bureauID + '&role_id=' + roleID;
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
