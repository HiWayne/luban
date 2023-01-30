import { useCallback, useRef, useState } from 'react';

export const usePagination = <T>(
  fetcher: (
    page: number,
    prevResponse: any,
  ) => Promise<{ list: T[]; more: boolean; total: number }>,
) => {
  const [response, setResponse] = useState<{
    list: T[];
    more: boolean;
    total: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(true);

  const loadingRef = useRef(false);
  const moreRef = useRef(true);

  const fetch = useCallback(
    async (params?: any) => {
      if (loadingRef.current || !moreRef.current) {
        return;
      }
      loadingRef.current = true;
      setLoading(true);
      const data = await fetcher(page, params).finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
      setPage((c) => c + 1);
      setResponse(data);
      if (data && typeof data.more === 'boolean') {
        moreRef.current = data.more;
        setMore(data.more);
      }
    },
    [page, fetcher, loading, more],
  );

  return {
    response,
    fetch,
    loading,
    more,
  };
};
