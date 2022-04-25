export const signIn = async (url: string, data: any) => {
  const email = data.email;
  const password = data.password;
  const postUrl = url + '?email=' + email + '&password=' + password;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res;
};
