import { SponsorActivity } from '@type/common';

export const post = async (url: string, data: SponsorActivity) => {
  const res = await fetch(url, {
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
  console.log('putUrl: ', url);
  const res = await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const getByFiler = async (
  url: string,
  isDone: string,
  styleIds: number[],
  keyword: string,
  allSponsorStyleLen: number,
) => {
  // TODO APIのリファクタリング NOTE 0件選択のとき全件取得するため存在しないidを指定している
  const postStyleIds = styleIds.length > 0 ? styleIds : [allSponsorStyleLen + 1];
  const isDoneURL = `is_done=${isDone}`;
  const styleIdsURL = `sponsor_style_id=${postStyleIds}`;
  const keywordURL = `keyword=${keyword}`;
  const getURL = `${url}?${isDoneURL}&${styleIdsURL}&${keywordURL}`;
  const res = await fetch(getURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};
