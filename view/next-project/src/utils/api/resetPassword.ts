export const reserPasswordRequest = async (url: string, email: string) => {
  const postUrl = url + '?email=' + email;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res;
};
