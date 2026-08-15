import { authFetch } from './authFetch';

export const del = async (url: string, accessToken?: string) => {
  const res = await authFetch(url, {
    method: 'DELETE',
    headers: {
      // 明示指定がない場合は authFetch が store のトークンを付与する
      ...(accessToken ? { 'Access-Token': accessToken } : {}),
    },
  });
  return await res;
};
