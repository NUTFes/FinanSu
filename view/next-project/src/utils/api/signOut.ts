export const signOut = async (url: string) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'access-token': localStorage.getItem('access-token') || 'none',
    },
  });
  return await res;
};
