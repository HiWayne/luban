import { NodeAST as NodeASTOfBackstage } from '../../../types/backstage';
import { NodeAST as NodeASTOfFrontstage } from '../../../types/frontstage';
import {
  generateCodeByNodeAST as generateCodeByNodeASTOfBackstage,
  generateCodeOfReactLogics,
} from './generateBackstageCodePlugins';
import { generateCodeByNodeAST as generateCodeByNodeASTOfFrontstage } from './generateFrontstageCodePlugins';
import {
  generateCommonCodeOfBackstage,
  generateCommonCodeOfFrontstage,
} from './generateBackstageCodePlugins/generateCommonCode';
import { createComponentName } from './utils';
import { LogicAST, PageModel } from '../../../types';

export interface Declarations {
  has: (name: string) => boolean;
  declarations: { name: string; code: string }[];
  put: (declaration: { name: string; code: string }) => void;
  toString: () => string;
}

export interface Context {
  development: boolean;
}

/**
 * 调用astToReactNodeCodeOfBackstage将nodeAST编译成react代码，
 */
export const astToReactNodeCodeOfBackstage = (
  nodeAST: NodeASTOfBackstage,
  declarations: Declarations,
  context: Context,
): { declarations: Declarations; call: string } => {
  let childrenCode = '';
  if (
    nodeAST &&
    Array.isArray(nodeAST.children) &&
    nodeAST.children.length > 0
  ) {
    childrenCode = nodeAST.children.reduce((code, node) => {
      const { call: _call } = astToReactNodeCodeOfBackstage(
        node,
        declarations,
        context,
      );
      return code + _call;
    }, '');
  }
  const {
    declaration: thisDeclaration,
    call,
    name,
  } = generateCodeByNodeASTOfBackstage(
    context,
    nodeAST,
    declarations,
    childrenCode,
  );

  if (thisDeclaration) {
    declarations.put({ code: thisDeclaration, name });
  }

  return {
    declarations,
    call,
  };
};

export const astToReactNodeCodeOfFrontstage = (
  nodeAST: NodeASTOfFrontstage,
  declarations: Declarations,
  context: Context,
): { declarations: Declarations; call: string } => {
  let childrenCode = '';
  if (
    nodeAST &&
    Array.isArray(nodeAST.children) &&
    nodeAST.children.length > 0
  ) {
    childrenCode = nodeAST.children.reduce((code, node) => {
      const { call: _call } = astToReactNodeCodeOfFrontstage(
        node,
        declarations,
        context,
      );
      return code + _call;
    }, '');
  }
  const {
    declaration: thisDeclaration,
    call,
    name,
  } = generateCodeByNodeASTOfFrontstage(
    context,
    nodeAST,
    declarations,
    childrenCode,
  );

  if (thisDeclaration) {
    declarations.put({ code: thisDeclaration, name });
  }

  return {
    declarations,
    call,
  };
};

const astToReactLogicCode = (logics?: LogicAST[]) => {
  return generateCodeOfReactLogics(logics);
};

const createDeclarations = (): Declarations => ({
  declarations: [],
  has(name: string) {
    const that: any = this;
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.has的this不是Declarations');
    }
    return that.declarations.some(
      (item: { name: string; code: string }) => item.name === name,
    );
  },
  put(declarationData: { name: string; code: string }) {
    const that: any = this;
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.put的this不是Declarations');
    }
    if (!that.has(declarationData.name)) {
      that.declarations.push(declarationData);
    }
  },
  toString() {
    const that: any = this;
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.toString的this不是Declarations');
    }
    return this.declarations.reduce(
      (string, declaration) => `${string}${declaration.code}`,
      '',
    );
  },
});

export const generateReactSourceCodeOfBackstage = (
  pageModel: PageModel,
  development: boolean,
) => {
  const componentName = createComponentName(pageModel.meta.key);

  const componentsDeclarations = createDeclarations();

  const { declarations, call } = astToReactNodeCodeOfBackstage(
    pageModel.view as NodeASTOfBackstage,
    componentsDeclarations,
    {
      development,
    },
  );

  const reactCode = `
  import { StrictMode, useState, useMemo, useRef, useEffect, useCallback, useContext } from 'react';
  import { createRoot } from 'react-dom/client';
  import { produce } from 'immer';
  import axios from 'axios';
  import zhCN from 'antd/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import { ConfigProvider, Form, Space, Input, Select, Radio, Checkbox, DatePicker, Table, Button, Image, Row, Col, Avatar, Typography, notification, Pagination, Modal } from 'antd';

  const { PreviewGroup } = Image;
  const { RangePicker } = DatePicker;

  dayjs.locale('zh-cn');

  ${generateCommonCodeOfBackstage()}
  
  ${declarations.toString()}

  const ${componentName} = () => {
    ${astToReactLogicCode(pageModel.logics)}

    return (${call})
  };

  const App = ({ setUpdateCount }) => {
    useEffect(() => {
      setUpdateCount()
    }, [])

    return (<StrictMode><ConfigProvider locale={zhCN}><${componentName} /></ConfigProvider></StrictMode>)
  }`;

  return reactCode;
};

export const generateReactSourceCodeOfFrontstage = (
  pageModel: PageModel,
  development: boolean,
) => {
  const componentName = createComponentName(pageModel.meta.key);

  const componentsDeclarations = createDeclarations();

  const { declarations, call } = astToReactNodeCodeOfFrontstage(
    pageModel.view as NodeASTOfFrontstage,
    componentsDeclarations,
    {
      development,
    },
  );

  const reactCode = `
  import { StrictMode, useState, useMemo, useRef, useEffect, useCallback, useContext } from 'react';
  import { createRoot } from 'react-dom/client';
  import { produce } from 'immer';
  import axios from 'axios';
  import styled from 'styled-components';
  import { ScrollList } from '@duitang/dt-react-mobile';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');

  ${generateCommonCodeOfFrontstage()}

  const Root = styled.div\`
    margin: 0;
    padding: 0;
    font-size: 0;
  \`

  ${declarations.toString()}

  const ${componentName} = () => {
    ${astToReactLogicCode(pageModel.logics)}

    return (${call})
  };

  ${
    pageModel.meta.mode === 'development'
      ? `const App = ({ setUpdateCount }) => {
    useEffect(() => {
      setUpdateCount()
    }, [])`
      : `const App = () => {`
  }

    return (<StrictMode><Root><${componentName} /></Root></StrictMode>)
}`;

  return reactCode;
};
