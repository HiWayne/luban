import { useMemo, useState } from 'react';
import { TablePaginationConfig } from 'antd';
import { executeFunction, verifyExecuteResult } from '@core/utils/index';
import { useTree } from '@core/hooks/index';
import { fetchByApiConfig } from '@core/hooks/useApi';

/**
 * @description 解析pagination配置的hooks
 * @param {Pagination} paginationConfig pagination配置，必须
 * @param {any} nodeState pagination判断loading等状态的数据来源，不传则默认取自pagination.api.effect
 * @returns {pagination: TablePaginationConfig, isLoading: boolean}
 */
const usePagination = (paginationConfig: Pagination | undefined, nodeState?: any) => {
  const { nodeState: _nodeState = [] } = useTree({ state: paginationConfig?.api?.effect });
  nodeState = nodeState || _nodeState;
  // 是否正在请求
  const isLoading = nodeState[0]?._loading;
  // 是否是init类型的请求，是 则翻页器回到第一页
  const isInit = nodeState[0]?._init;

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);

  if (isInit && currentPage !== 1) {
    setCurrentPage(1);
  }

  const { handleStateChange, nodeModel } = useTree({
    effect: paginationConfig?.api.effect,
    model: paginationConfig?.api.model,
  });

  const pagination: TablePaginationConfig | boolean = useMemo(() => {
    if (paginationConfig) {
      const limit = paginationConfig.limit;
      let startParams = {},
        hasMore = false,
        total = 0;
      if (paginationConfig.computeTotal) {
        total = executeFunction(paginationConfig.computeTotal, nodeState[0]?.response);
        if (!verifyExecuteResult(total)) {
          console.error('paginationConfig.computeTotal occurred error in table pagination');
          return false;
        }
      }
      return paginationConfig
        ? {
            position: ['bottomRight'],
            current: currentPage,
            pageSize: limit,
            total: total,
            onChange(page: number, pageSize: number | undefined) {
              if (paginationConfig.computeMore) {
                hasMore = executeFunction(paginationConfig.computeMore, nodeState[0]?.response, page);
                if (!verifyExecuteResult(hasMore)) {
                  console.error('paginationConfig.computeMore occurred error in table pagination');
                  return false;
                }
              }
              if (!paginationConfig.computeMore) {
                hasMore = total - (page - 1) * pageSize! > 0;
              }
              if (!hasMore) {
                return;
              }

              if (paginationConfig.computeStart) {
                startParams = executeFunction(paginationConfig.computeStart, nodeState[0]?.response);
                if (!verifyExecuteResult(startParams)) {
                  console.error('paginationConfig.computeStart occurred error in table pagination');
                  return false;
                }
              }
              if (!paginationConfig.computeStart) {
                startParams = { start: (page - 1) * pageSize! };
              }
              const params = { ...nodeModel[0], ...startParams, limit: pageSize };
              setPaginationLoading(true);
              fetchByApiConfig(paginationConfig.api, params, handleStateChange, nodeState[0])
                .then(() => {
                  setCurrentPage(page);
                })
                .finally(() => {
                  setPaginationLoading(false);
                });
            },
            disabled: paginationLoading,
          }
        : false;
    } else {
      return false;
    }
  }, [paginationConfig, nodeState, handleStateChange, nodeModel, paginationLoading, currentPage]);

  return {
    pagination,
    isLoading,
  };
};

export default usePagination;
