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
  const contact_person = data.contact_person;
  const fund_date = data.fund_date;
  const fund_time = data.fund_time;
  const price = data.price;
  const detail = data.detail;
  const report_person = data.report_person;
  const report_price = data.report_price;
  const postUrl =
    url +
    '?contact_person="' +
    contact_person +
    '"&fund_date="' +
    fund_date +
    '"&fund_time="' +
    fund_time +
    '"&price=' +
    price +
    '&detail="' +
    detail +
    '"&report_person="' +
    report_person +
    '"&report_price=' +
    report_price;
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
  const teacher_id = data.teacher_id;
  const price = data.price;
  const remark = data.remark;
  const is_first_check = data.is_first_check;
  const is_last_check = data.is_last_check;
  const putUrl =
    url +
    '?user_id=' +
    user_id +
    '&teacher_id=' +
    teacher_id +
    '&price=' +
    price +
    '&remark=' +
    remark +
    '&is_first_check=' +
    is_first_check +
    '&is_last_check=' +
    is_last_check;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

export const del = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  return await res.json();
};
