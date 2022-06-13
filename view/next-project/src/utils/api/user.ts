export const post = async (url: string, data: any) => {
  const name = data.userName;
  const bureau_id = data.bureauId;
  const role_id = data.roleId;
  const postUrl = url + '?name=' + name + '&bureau_id=' + bureau_id + '&role_id=' + role_id;
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

export const put = async (url: string, data: any) => {
  const name = data.name;
  const bureau_id = data.bureau_id;
  const role_id = data.role_id;
  const putUrl = url + '?name=' + name + '&bureau_id=' + bureau_id + '&role_id=' + role_id;
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
