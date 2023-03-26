import { SponsorActivity } from '@type/common';

export const post = async (url: string, data: SponsorActivity) => {
  const sponsorID = data.sponsorID;
  const sponsorStyleID = data.sponsorStyleID;
  const userID = data.userID;
  const isDone = data.isDone;
  const postUrl =
    url +
    '?sponsorID=' +
    sponsorID +
    '&sponsorStyleID=' +
    sponsorStyleID +
    '&userID=' +
    userID +
    '&isDone=' +
    isDone;
  console.log(postUrl);
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
  const postUrl =
    url +
    '?sponsorID=' +
    sponsorID +
    '&sponsorStyleID=' +
    sponsorStyleID +
    '&userID=' +
    userID +
    '&isDone=' +
    isDone;
  const res = await fetch(postUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};
