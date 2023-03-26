import { SponsorActivity } from '@type/common';

export const post = async (url: string, data: SponsorActivity) => {
  const sponsorID = data.sponsorID;
  const sponsorStyleID = data.sponsorStyleID;
  const userID = data.userID;
  const isDone = data.isDone;
  const postUrl =
    url +
    '?sponsor_id=' +
    sponsorID +
    '&sponsor_style_id=' +
    sponsorStyleID +
    '&user_id=' +
    userID +
    '&is_done=' +
    isDone;
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
  const putUrl =
    url +
    '?sponsor_id=' +
    sponsorID +
    '&sponsor_style_id=' +
    sponsorStyleID +
    '&user_id=' +
    userID +
    '&is_done=' +
    isDone;

  console.log('putUrl: ', putUrl)
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
