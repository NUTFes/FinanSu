import { Sponser } from '@type/common';

export const post = async (url: string, data: Sponser) => {
  const name = data.name;
  const tel = data.tel;
  const email = data.email;
  const address = data.address;
  const representative = data.representative;
  const postUrl =
    url +
    '?name=' +
    name +
    '&tel=' +
    tel +
    '&email=' +
    email +
    '&address=' +
    address +
    '&representative=' +
    representative;

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

export const put = async (url: string, data: Sponser) => {
  const name = data.name;
  const tel = data.tel;
  const email = data.email;
  const address = data.address;
  const representative = data.representative;
  const postUrl =
    url +
    '?name=' +
    name +
    '&tel=' +
    tel +
    '&email=' +
    email +
    '&address=' +
    address +
    '&representative=' +
    representative;

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
