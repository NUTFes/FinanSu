import { SponsorActivity } from '@type/common';

export const post = async (url: string, data: SponsorActivity) => {
  const sponsorID = data.sponsorID;
  const sponsorStyleID = data.sponsorStyleID;
  const userID = data.userID;
  const isDone = data.isDone;
  const feature = data.feature;
  const expense = data.expense;
  const remark = data.remark;
  const postUrl =
    url +
    '?sponsor_id=' +
    sponsorID +
    '&sponsor_style_id=' +
    sponsorStyleID +
    '&user_id=' +
    userID +
    '&is_done=' +
    isDone +
    '&feature=' +
    feature +
    '&expense=' +
    expense +
    '&remark=' +
    remark;
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

export const put = async (url: string, data: SponsorActivity) => {
  const sponsorID = data.sponsorID;
  const sponsorStyleID = data.sponsorStyleID;
  const userID = data.userID;
  const isDone = data.isDone;
  const feature = data.feature;
  const expense = data.expense;
  const remark = data.remark;
  const putUrl =
    url +
    '?sponsor_id=' +
    sponsorID +
    '&sponsor_style_id=' +
    sponsorStyleID +
    '&user_id=' +
    userID +
    '&is_done=' +
    isDone +
    '&feature=' +
    feature +
    '&expense=' +
    expense +
    '&remark=' +
    remark;

  console.log('putUrl: ', putUrl);
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
