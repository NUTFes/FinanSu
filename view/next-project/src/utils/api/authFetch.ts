import { useAuthStore } from '@/store/authStore';

const publicPaths = ['/mail_auth/signin', '/mail_auth/signup', '/password_reset/'];

const isPublicRequest = (url: string) => publicPaths.some((path) => url.includes(path));

export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = input instanceof Request ? input.url : input.toString();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));

  if (!isPublicRequest(url)) {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) headers.set('Access-Token', accessToken);
  }

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 && typeof window !== 'undefined') {
    useAuthStore.getState().resetAuth();
    if (window.location.pathname !== '/') window.location.assign('/');
  }
  return response;
};
