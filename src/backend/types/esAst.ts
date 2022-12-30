// 字面量
export interface Literal {
  type: 'Literal';
  value: number | string;
  raw: string;
}

// 标识符
export interface Identifier {
  type: 'Identifier';
  name: string;
}

// 数组表达式
export interface ArrayExpression {
  type: 'ArrayExpression';
  elements: (
    | Identifier
    | Literal
    | ArrayExpression
    // eslint-disable-next-line no-use-before-define
    | ObjectExpression
    // eslint-disable-next-line no-use-before-define
    | CallExpression
  )[];
}

// 对象属性
export interface Property {
  type: 'Property';
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  key: Identifier;
  kind: 'init';
  // eslint-disable-next-line no-use-before-define
  value:
    | Identifier
    | Literal
    | ArrayExpression
    // eslint-disable-next-line no-use-before-define
    | ObjectExpression
    // eslint-disable-next-line no-use-before-define
    | CallExpression;
}

// 对象表达式
export interface ObjectExpression {
  type: 'ObjectExpression';
  properties: Property[];
}

// 数组模式（解构）
export interface ArrayPattern {
  type: 'ArrayPattern';
  elements: Identifier[];
}

// 对象模式（解构）
export interface ObjectPattern {
  type: 'ObjectPattern';
  properties: Property[];
}

// 函数调用表达式
export interface CallExpression {
  type: 'CallExpression';
  callee: Identifier;
  arguments: (
    | Identifier
    | Literal
    | ObjectExpression
    | ArrayExpression
    | CallExpression
  )[];
}

// 变量声明符
export interface VariableDeclarator {
  type: 'VariableDeclarator';
  id: Identifier | ObjectPattern | ArrayPattern;
  init:
    | CallExpression
    | Literal
    | Identifier
    | ArrayExpression
    | CallExpression
    | ObjectExpression;
}

// 变量声明
export interface VariableDeclaration {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
}

// JavaScript AST
export interface EsAst {
  type: 'Program';
  body: VariableDeclaration[];
}
