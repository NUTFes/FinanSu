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
  const name = data.userName;
  const department_id = data.departmentId;
  const role_id = data.roleId;
  const postUrl = url + '?name=' + name + '&department_id=' + department_id + '&role_id=' + role_id;
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
  const name = data.userName;
  const department_id = data.departmentId;
  const role_id = data.roleId;
  const putUrl = url + '?name=' + name + '&department_id=' + department_id + '&role_id=' + role_id;
  console.log(putUrl, data.price, data.year_id, data.source_id);
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