import { NodeAST as NodeASTOfBackstage } from './backstage';
import { NodeAST as NodeASTOfFrontstage } from './frontstage';

export type VariableName = `${string}_scope_variable_name_${string}`;

export type FunctionCode = string;

export type Env = ('pc' | 'mobile' | 'app' | 'react' | 'vue' | 'mpa' | 'spa')[];

export type Mode = 'development' | 'production';

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
