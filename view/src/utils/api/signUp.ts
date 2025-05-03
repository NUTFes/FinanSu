import { SignUp } from '@type/common';

export const signUp = async (url: string, data: SignUp, userID: number) => {
  const email = data.email;
  const password = data.password;
  const postUrl = url + '?email=' + email + '&password=' + password + '&user_id=' + userID;
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
