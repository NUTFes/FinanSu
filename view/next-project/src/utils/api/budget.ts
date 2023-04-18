import { Budget } from '@type/common';

export const post = async (url: string, data: Budget) => {
  const price = data.price;
  const yearID = data.yearID;
  const sourceID = data.sourceID;
  const postUrl = url + '?price=' + price + '&year_id=' + yearID + '&source_id=' + sourceID;
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

export const put = async (url: string, data: Budget) => {
  const price = data.price;
  const yearID = data.yearID;
  const sourceID = data.sourceID;
  const putUrl = url + '?price=' + price + '&year_id=' + yearID + '&source_id=' + sourceID;
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

