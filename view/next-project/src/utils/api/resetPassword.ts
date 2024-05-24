import { PasswordResetData } from '@/type/common';

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

export const resetPasswordTokenValid = async (url: string) => {
  const postUrl = url;
  const res = await fetch(postUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res;
};

export const resetPassword = async (url: string, data: PasswordResetData) => {
  const postUrl = url;
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
