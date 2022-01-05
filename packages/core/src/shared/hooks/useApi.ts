import { notification } from 'antd';
import { useCallback } from 'react';
import { Api, Method } from '@core/types/types';
import { readValueByPath } from '@core/utils/operateValueByPath';
import {
  executeFunction,
  getIdentifierProperty,
  IDENTIFIER_INIT,
  IDENTIFIER_REFRESH,
  verifyExecuteResult,
} from '@core/utils/others';
import request from '@core/utils/request';
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

/**
 * @description 根据api配置生成请求函数
 * @param {Api} params.api api配置对象，必须
 * @param {object | undefined} params.originalParams 原始请求参数（因为可能经过计算函数），不传则取api.model指向的数据
 * @param {function | undefined} params.callback 请求回调函数，不传则根据api.effect修改状态
 * @param {boolean} params.notify 请求结束是否显示通知，不传则为true
 * @param {Path | MaybeHasSubPath} params.state 上次请求存放的state位置，不传默认取api.effect
 * @returns {function} 请求函数
 */
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
        typeof callback === 'function' ? callback : api?.effect ? handleStateChange : undefined,
        nodeState[0],
        modelTree,
        notify,
      ),
    [api, originalParams, notify, callback, modelTree, nodeState, handleStateChange, nodeModel],
  );
};

export default useApi;
