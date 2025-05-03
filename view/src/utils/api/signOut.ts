export const del = async (url: string, accessToken?: string) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'access-token': accessToken ? accessToken : localStorage.getItem('access-token') || 'none',
    },
  });
  return await res;
};
