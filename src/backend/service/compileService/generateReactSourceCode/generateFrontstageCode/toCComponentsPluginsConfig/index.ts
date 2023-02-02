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
  | 'custom-style';

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
  sort: number;
  name: string;
  type:
    | 'BlockContainer'
    | 'InlineContainer'
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
