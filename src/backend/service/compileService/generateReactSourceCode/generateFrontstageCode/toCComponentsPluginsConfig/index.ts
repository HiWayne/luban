import { FC } from 'react';
import { NodeAST } from '@/backend/types/frontstage/index';

export * from './commonConfig';

export type FormSchemaType =
  | 'input'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'switch'
  | 'image-upload'
  | 'color-picker'
  | 'css-length'
  | 'variable-select'
  | 'css-margin'
  | 'css-padding'
  | 'css-border-radius'
  | 'custom-style'
  | 'image-src'
  | 'text-content'
  | 'bg-size';

export interface FormSchema {
  type: FormSchemaType;
  options?: { label: string; value: any }[];
  placeholder?: string;
  props?: Record<string, any>;
}

export interface Config {
  name: string;
  description: string;
  formSchema?: FormSchema;
  FormComponent?: FC;
  required: boolean;
  propName: string;
  defaultConfig?: any;
}

export interface ToCComponent {
  // 组件等级，1-基础组件、2-复合组件
  level: 1 | 2;
  sort: number;
  // 是否能有子组件
  leaf?: boolean;
  // html是否是空标签（不能有子元素，如img、hr）
  emptyTag?: boolean;
  name: string;
  type:
    | 'BasicContainer'
    | 'FlexContainer'
    | 'GridContainer'
    | 'ScrollList'
    | 'Image'
    | 'Text'
    | 'Paragraph';
  description: string;
  defaultAST: Omit<NodeAST, 'id' | 'parent'>;
  configs: Config[];
}
