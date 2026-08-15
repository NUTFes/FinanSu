import { authFetch } from './authFetch';

export const get = async (url: string) => {
  const res = await authFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

// 一覧取得用。認証エラー時などレスポンスが配列でない場合は空配列を返す
export const getList = async <T>(url: string): Promise<T[]> => {
  const res = await get(url);
  return Array.isArray(res) ? (res as T[]) : [];
};

export const get_with_token = async (url: string, accessToken?: string) => {
  const res = await authFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 明示指定がない場合は authFetch が store のトークンを付与する
      ...(accessToken ? { 'Access-Token': accessToken } : {}),
    },
  });
  return await res.json();
};

export const del = async (url: string) => {
  const res = await authFetch(url, { method: 'DELETE' });
  return await res.json();
};

export const post = async (url: string, data: unknown) => {
  const res = await authFetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const put = async (url: string, data: unknown) => {
  const res = await authFetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
  return res;
};

export const multiDel = async (url: string, data: number[]) => {
  const res = await authFetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deleteIDs: data }),
  });
  return await res.status;
};

export const get_with_token_valid = async (url: string, accessToken?: string) => {
  try {
    const res = await authFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 明示指定がない場合は authFetch が store のトークンを付与する
        ...(accessToken ? { 'Access-Token': accessToken } : {}),
      },
    });
    return res.status === 200;
  } catch (error) {
    // ネットワークエラー・CORSエラー時もセッション無効として扱う
    console.error('Failed to validate session:', error);
    return false;
  }
};
