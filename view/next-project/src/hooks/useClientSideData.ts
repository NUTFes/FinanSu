import { useEffect, useRef, useState } from 'react';

import { useAuthStore } from '@/store/authStore';

/**
 * getServerSideProps の代わりに、クライアント側で認証付きのデータ取得を行うためのフック。
 *
 * アクセストークンは localStorage に永続化されており Node.js 側からは参照できないため、
 * 認証が必要なエンドポイントは SSR ではなくクライアントから叩く必要がある。
 * store の hydration が完了し、トークンが利用可能になってから取得を開始する。
 */
export const useClientSideData = <T>(fetcher: () => Promise<T>) => {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  // fetcher は呼び出し側で毎レンダリング生成されるため、依存配列には含めずに ref で保持する
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    // 未ログインの場合は MainLayout 側でログイン画面へリダイレクトされる
    if (!hasHydrated || !accessToken) return;

    let isActive = true;

    fetcherRef
      .current()
      .then((result) => {
        if (isActive) setData(result);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [hasHydrated, accessToken]);

  return { data, isLoading };
};
