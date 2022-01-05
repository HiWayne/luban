import { FunctionComponent } from 'react';
import { isNil, isEmpty } from 'ramda';
import { notification } from 'antd';
import request from '@core/utils/request';
import { ComponentNames, Method, Api, ComponentLevel, ColumnNames } from '@core/types/types';
import { readValueByPath } from '@core/utils/operateValueByPath';

const GET = request('get');
const POST = request('post');
const PUT = request('put');
const DELETE = request('delete');

export const isShow = (state?: string[] | string[][], stateValue?: any) =>
  isValidPath(state) ? !isNil(stateValue) && !isEmpty(stateValue) && stateValue !== false : true;

export const isValidPath = (path?: string[] | string[][]) =>
  Array.isArray(path) ? (hasSubPath(path) ? true : (path as string[]).length > 0) : false;

export const hasSubPath = (path?: string[] | string[][]) =>
  Array.isArray(path) ? path.some((subPath) => Array.isArray(subPath)) : false;

export const defineProperty = (
  target: FunctionComponent<any>,
  property: string,
  value: any,
  config?: PropertyDescriptor,
) => {
  config = config || {};
  Reflect.defineProperty(target, property, {
    value,
    enumerable: false,
    configurable: false,
    ...config,
  });
};

const createDefineProperty =
  <T>(property: string, config?: PropertyDescriptor) =>
  (target: FunctionComponent<any>, value: T) =>
    defineProperty(target, property, value, config);

const createGetProperty = (property: string) => (target: any) => Reflect.get(target, property);

const NAME = '_name';
export const definePropertyOfName = createDefineProperty<ComponentNames | ColumnNames>(NAME);
export const getNameProperty = createGetProperty(NAME);

const ALIAS_NAME = '_aliasName';
export const definePropertyOfAliasName = createDefineProperty<string>(ALIAS_NAME);
export const getAliasNameProperty = createGetProperty(ALIAS_NAME);

const LEVEL = '_level';
export const definePropertyOfLevel = createDefineProperty<ComponentLevel[]>(LEVEL);
export const getLevelProperty = createGetProperty(LEVEL);

const IDENTIFIER = '_identifier';
export const IDENTIFIER_REFRESH = 'refresh';
export const IDENTIFIER_INIT = 'init';
export const definePropertyOfIdentifier = createDefineProperty<string>(IDENTIFIER);
export const getIdentifierProperty = createGetProperty(IDENTIFIER);

const CONFIG = '_config';
export const definePropertyOfConfig = createDefineProperty<{ [key in ComponentLevel]: object }>(CONFIG);
export const getConfigProperty = createGetProperty(CONFIG);

const ERROR_SIGN = Symbol('ERROR_SIGN');

export const executeFunction = (functionString?: string, ...args: any[]) => {
  try {
    // eslint-disable-next-line no-new-func
    const _function = functionString ? new Function('...args', `return (${functionString})(...args)`) : (v: any) => v;
    return _function(...args);
  } catch (e) {
    return ERROR_SIGN;
  }
};

export const verifyExecuteResult = (result: any) => result !== ERROR_SIGN;

export const getEventValue = (e: any) => {
  if (e && e.target && e.target.hasOwnProperty('value')) {
    return e.target.value;
  } else {
    return e;
  }
};

export const createSingleton = () => {
  let isCall = false,
    result: { current: any } = { current: null };
  return (singleton: any) => {
    if (!isCall) {
      isCall = true;
      result.current = singleton;
      return result;
    } else {
      return result;
    }
  };
};

export const fetchByApiConfig = async (
  api: Api,
  originalParams?: any,
  callback?: (response?: any, effect?: Path) => void,
  state?: any,
  modelTree?: ModelTree,
  notify?: boolean,
) => {
  if (api) {
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
    result.params = result._refresh ? result.params : originalParams;
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
    if (isValidPath(api.effect) && typeof callback === 'function') {
      callback({ ...result, _loading: true }, api.effect);
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
      if (isValidPath(api.effect) && typeof callback === 'function') {
        callback({ ...result }, api.effect);
      }
      if (!result.response || error) {
        return Promise.reject();
      } else {
        return Promise.resolve(result);
      }
    }
  }
};
