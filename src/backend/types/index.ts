import { NodeAST as NodeASTOfBackstage } from './backstage';
import { NodeAST as NodeASTOfFrontstage } from './frontstage';

export type VariableName = `${string}_scope_variable_${string}`;

export type FunctionCode = string;

export type BuiltInType = 'function' | 'variable';

// 内置类型代码。比如"index"应该在prop里编译成变量: index={index}，但实际它只是字符串: index="index"，所以需要内置类型来说明如何编译
export interface BuiltInTypeCode {
  _builtInType: BuiltInType;
  code: string;
}

export type Env = ('pc' | 'mobile' | 'app' | 'react' | 'vue' | 'mpa' | 'spa')[];

export type Mode = 'development' | 'production' | 'deploy';

export interface Meta {
  title: string;
  key: string;
  path: string;
  params?: Object;
  icon?: string;
  env: Env;
  mode: Mode;
}

export type Condition = [VariableName, number | string | VariableName];

type LogicType = 'state' | 'ref' | 'effect' | 'declaration' | 'call' | 'memo';

export interface LogicAST {
  id: number;
  type: LogicType;
  identifiers: { name: string }[];
  raw: string;
}

export interface PageModel {
  meta: Meta;
  logics?: LogicAST[];
  view: NodeASTOfBackstage | NodeASTOfFrontstage;
}

export interface FetchData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: VariableName;
  body?: VariableName;
  computeParams?: FunctionCode;
  computeBody?: FunctionCode;
  computeResponse?: FunctionCode;
}

export interface InteractData {
  setState: VariableName;
  // 覆盖 | 增量
  mode: 'Cover' | 'Increase';
}

export interface PaginationStartComputeData {
  code: string;
}

export interface NavigateData {
  url?: string;
  method?: '_blank' | 'self';
}

export type ActionType =
  | 'Fetch'
  | 'Interact'
  | 'PaginationStartCompute'
  | 'Navigate';

export interface Action {
  type: ActionType;
  data: FetchData | InteractData | PaginationStartComputeData | NavigateData;
  output?: VariableName;
  receive?: VariableName | number | string;
  next?: Action;
}
