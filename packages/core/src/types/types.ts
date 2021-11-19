import { FunctionComponent } from 'react';

export enum ComponentNames {
  INPUT = 'input',
  FORM = 'form',
  BUTTON = 'button',
  TABLE = 'table',
  MODAL = 'modal',
  DATEPICKER = 'datepicker',
  MOUNT = 'mount',
}

export enum ColumnNames {
  TEXT = 'text',
  A = 'a',
  SINGLE_IMAGE = 'singleImage',
  MULTI_IMAGES = 'multiImages',
  TIME = 'time',
  COPY = 'copy',
  TAGS = 'tags',
}

export interface ComponentsObject {
  [key: string]: FunctionComponent<any>;
}

export enum ComponentLevel {
  BASIC = 'basic',
  ADVANCED = 'advanced',
}

export enum Size {
  small = 'small',
  middle = 'middle',
  large = 'large',
}

export enum ButtonType {
  primary = 'primary',
  ghost = 'ghost',
  dashed = 'dashed',
  link = 'link',
  text = 'text',
  default = 'default',
}

export enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  POST_FORM = 'post_form',
  PUT_FORM = 'put_form',
  HEAD = 'head',
  OPTIONS = 'options',
  CONNECT = 'connect',
  TRACE = 'trace',
  PATCH = 'patch',
}

export interface Api {
  method: Method;
  url: string;
  effect?: Path;
  model?: Path;
  computeParams?: string;
  rules?: string;
}

export enum DatePickerType {
  DATE = 'date',
  RANGE = 'range',
}

export enum PickerType {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  TIME = 'time',
}

export enum OffsetConst {
  TOP_OFFSET = 0.5,
  LEFT_OFFSET = 0.5,
  SMALL_TOP_OFFSET = 0.25,
  SMALL_LEFT_OFFSET = 0.25,
  MINI_TOP_OFFSET = 0.125,
  MINI_LEFT_OFFSET = 0.125,
}
