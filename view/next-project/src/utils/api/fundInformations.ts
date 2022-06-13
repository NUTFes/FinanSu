export const post = async (url: string, data: any) => {
  const user_id = data.user_id;
  const teacher_id = data.teacher_id;
  const price = data.price;
  const remark = data.remark;
  const is_first_check = data.is_first_check;
  const is_last_check = data.is_last_check;
  const postUrl =
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
  return await res;
};
