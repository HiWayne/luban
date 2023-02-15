import { useCallback, useRef, useState } from 'react';

export const usePagination = <T>(
  fetcher: (
    page: number,
    prevResponse?: any,
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
  const [total, setTotal] = useState(0);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const moreRef = useRef(true);

  const fetch = useCallback(
    async (params?: any) => {
      if (loadingRef.current || !moreRef.current) {
        return;
      }
      loadingRef.current = true;
      setLoading(true);
      const data = await fetcher(pageRef.current, params).finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
      pageRef.current += 1;
      setPage((c) => c + 1);
      setResponse(data);
      if (data && data.total) {
        setTotal(data.total);
      }
      if (data && typeof data.more === 'boolean') {
        moreRef.current = data.more;
        setMore(data.more);
      }
    },
    [fetcher],
  );

  const reset = useCallback(() => {
    setPage(1);
    pageRef.current = 1;
    setMore(true);
    moreRef.current = true;
    setLoading(false);
    loadingRef.current = false;
    setTotal(0);
  }, []);

  return {
    page,
    response,
    fetch,
    total,
    loading,
    more,
    reset,
  };
};
