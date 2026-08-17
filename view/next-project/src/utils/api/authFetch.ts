import { useAuthStore } from '@/store/authStore';

const publicPaths = ['/mail_auth/signin', '/mail_auth/signup', '/password_reset/'];

// pathname だけを見て判定する。クエリパラメータやハッシュに公開パスの文字列が
// 含まれる場合 (例: `?redirect=/mail_auth/signin`) に誤って公開リクエストと
// 判定され、Access-Token が付与されなくなるのを防ぐため。
const isPublicRequest = (urlStr: string) => {
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const { pathname } = new URL(urlStr, base);
    return publicPaths.some((path) => pathname.includes(path));
  } catch {
    return publicPaths.some((path) => urlStr.includes(path));
  }
};

export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = input instanceof Request ? input.url : input.toString();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init.headers).forEach((value, key) => headers.set(key, value));

  // 呼び出し側が明示的にトークンを指定している場合はそれを優先する
  // (ログイン直後など、store にまだ新しいトークンが入っていないケースがあるため)
  if (!isPublicRequest(url) && !headers.has('Access-Token')) {
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
