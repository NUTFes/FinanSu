import { SignUp, User } from '@type/common';

export const signUp = async (url: string, data: SignUp, user: User) => {
  const params = new URLSearchParams({
    email: data.email,
    password: data.password,
    name: user.name,
    bureau_id: String(user.bureauID),
    role_id: String(user.roleID),
  });
  const postUrl = url + '?' + params.toString();
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
