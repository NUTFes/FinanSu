import { FundInformation } from '@type/common';

export const post = async (url: string, data: FundInformation) => {
  const userID = data.userID;
  const teacherID = data.teacherID;
  const price = data.price;
  const remark = data.remark;
  const isFirstCheck = data.isFirstCheck;
  const isLastCheck = data.isLastCheck;
  const postUrl =
    url +
    '?user_id=' +
    userID +
    '&teacher_id=' +
    teacherID +
    '&price=' +
    price +
    '&remark=' +
    remark +
    '&is_first_check=' +
    isFirstCheck +
    '&is_last_check=' +
    isLastCheck;
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

export const put = async (url: string, data: FundInformation) => {
  const userID = data.userID;
  const teacherID = data.teacherID;
  const price = data.price;
  const remark = data.remark;
  const isFirstCheck = data.isFirstCheck;
  const isLastCheck = data.isLastCheck;
  const putUrl =
    url +
    '?userID=' +
    userID +
    '&teacher_id=' +
    teacherID +
    '&price=' +
    price +
    '&remark=' +
    remark +
    '&is_first_check=' +
    isFirstCheck +
    '&is_last_check=' +
    isLastCheck;
  const res = await fetch(putUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res;
};
