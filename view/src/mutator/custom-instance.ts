// NOTE: Supports cases where `content-type` is other than `json`
const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return c.json();
  }

  if (contentType && contentType.includes('application/pdf')) {
    return c.blob() as Promise<T>;
  }

  return c.text() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const baseURL = process.env.CSR_API_URI;
  const url = new URL(`${baseURL}${contextUrl}`);

  return url.toString();
};

// NOTE: Add headers
const getHeaders = (headers?: HeadersInit, body?: BodyInit): HeadersInit => {
  // FormData の場合は Content-Type ヘッダーを設定しない
  if (body instanceof FormData) {
    return {
      ...headers,
    };
  }

  return {
    ...headers,
    'Content-Type': 'application/json',
  };
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = getHeaders(options.headers, options.body ?? undefined);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
  };

  const request = new Request(requestUrl, requestInit);
  const response = await fetch(request);
  const data = await getBody<T>(response);

  if (!response.ok) {
    throw new Error(data as unknown as string);
  }

  return { status: response.status, data, headers: response.headers } as T;
};
