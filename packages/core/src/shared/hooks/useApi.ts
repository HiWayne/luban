import { notification } from 'antd';
import { useCallback } from 'react';
import { Api, Method } from 'types/types';
import { readValueByPath } from 'utils/operateValueByPath';
import {
  executeFunction,
  getIdentifierProperty,
  IDENTIFIER_INIT,
  IDENTIFIER_REFRESH,
  verifyExecuteResult,
} from 'utils/others';
import request from 'utils/request';
import useTree from './useTree';

const GET = request('get');
const POST = request('post');
const PUT = request('put');
const DELETE = request('delete');

export const fetchByApiConfig = async (
  api: Api,
  originalParams?: any,
  callback?: (response?: any, effect?: Path) => void,
  state?: any,
  modelTree?: ModelTree,
  notify?: boolean,
) => {
  const result = {
    response: state?.response,
    _loading: false,
    _refresh: false,
    _init: false,
    params: state?.params,
  };
  if (getIdentifierProperty(api) === IDENTIFIER_REFRESH) {
    result._refresh = true;
  } else if (getIdentifierProperty(api) === IDENTIFIER_INIT) {
    result._init = true;
  }
  const readModel = readValueByPath(modelTree, api.model);
  originalParams = originalParams || (readModel && readModel[0]);
  // 如果是refresh，复用上次的params去请求，即重新更新当前页的数据
  const params = result._refresh
    ? result.params
    : api.computeParams
    ? executeFunction(api.computeParams, originalParams)
    : originalParams;
  result.params = result._refresh ? result.params : params;
  if (!verifyExecuteResult(params)) {
    console.error('api.computeParams occurred error in "fetchByApiConfig"');
    return;
  }
  const isValid = api.rules ? executeFunction(api.rules, params) : true;
  if (!verifyExecuteResult(isValid)) {
    console.error('api.rules occurred error in "fetchByApiConfig"');
    return;
  }
  if (!isValid || typeof isValid === 'string') {
    notification['error']({
      message: '不符合规则的参数',
      description: isValid || '',
    });
    return Promise.reject(isValid || '不符合规则的参数');
  }
  if (typeof callback === 'function') {
    callback({ ...result, _loading: true });
  }
  let error;
  try {
    switch (api.method) {
      case Method.GET:
        result.response = await GET(api.url, params, notify);
        break;
      case Method.POST:
        result.response = await POST(api.url, params, notify);
        break;
      case Method.PUT:
        result.response = await PUT(api.url, params, notify);
        break;
      case Method.DELETE:
        result.response = await DELETE(api.url, params, notify);
        break;
      default:
        console.error(`api.method is not valid: ${api.method}`);
    }
  } catch {
    error = true;
  } finally {
    if (typeof callback === 'function') {
      callback({ ...result });
    }
    if (!result.response || error) {
      return Promise.reject();
    } else {
      return Promise.resolve(result);
    }
  }
};

interface UseApiParams {
  api: Api;
  originalParams?: any;
  callback?: (response?: any, effect?: Path) => void;
  notify?: boolean;
  state?: Path | MaybeHasSubPath;
}

const useApi = ({ api, originalParams, callback, notify, state }: UseApiParams) => {
  const {
    modelTree,
    nodeState = [],
    nodeModel,
    handleStateChange,
  } = useTree({ state: state || api?.effect, effect: api?.effect, model: api?.model });
  return useCallback(
    () =>
      fetchByApiConfig(
        api,
        originalParams || (nodeModel && nodeModel[0]),
        api?.effect ? handleStateChange : callback,
        nodeState[0],
        modelTree,
        notify,
      ),
    [api, originalParams, notify, callback, modelTree, nodeState, handleStateChange, nodeModel],
  );
};

export default useApi;
