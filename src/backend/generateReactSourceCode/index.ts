import { MutableRefObject } from 'react';
import { NodeAST as NodeASTOfBackstage } from '../types/backstage';
import { NodeAST as NodeASTOfFrontstage } from '../types/frontstage';
import {
  generateCodeByNodeAST as generateCodeByNodeASTOfBackstage,
  generateCodeOfReactLogics,
} from './generateBackstageCode';
import { generateCodeByNodeAST as generateCodeByNodeASTOfFrontstage } from './generateFrontstageCode';
import {
  generateCommonCodeOfBackstage,
  generateCommonCodeOfFrontstage,
} from './generateBackstageCode/generateCommonCode';
import { createComponentName } from './utils';
import { LogicAST, PageModel } from '../types';

export interface Declarations {
  has: (name: string) => boolean;
  declarations: { name: string; code: string }[];
  put: (declaration: { name: string; code: string }) => void;
  toString: () => string;
}

export interface Context {
  idRef: MutableRefObject<number>;
  commonComponentsDeclarations: Declarations;
}

/**
 * 调用astToReactNodeCodeOfBackstage将nodeAST编译成react代码，
 */
export const astToReactNodeCodeOfBackstage = (
  nodeAST: NodeASTOfBackstage,
  declarations: Declarations,
  context: Context,
) => {
  const id = ++context.idRef.current;
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
    id,
    context,
    nodeAST,
    declarations,
    childrenCode,
  );

  if (thisDeclaration) {
    declarations.put({ code: thisDeclaration, name });
  }

  return {
    declarations: declarations.toString(),
    call,
  };
};

export const astToReactNodeCodeOfFrontstage = (
  nodeAST: NodeASTOfFrontstage,
  declarations: string[],
  context: Context,
): { declarations: string; call: string } => {
  const id = ++context.idRef.current;
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
  const { declaration: thisDeclaration, call } =
    generateCodeByNodeASTOfFrontstage(
      id,
      context,
      nodeAST,
      declarations,
      childrenCode,
    );

  declarations.push(thisDeclaration);

  return {
    declarations: declarations.join(''),
    call,
  };
};

const astToReactLogicCode = (logics?: LogicAST[]) => {
  return generateCodeOfReactLogics(logics);
};

const createDeclarations = (): Declarations => ({
  declarations: [],
  has(name: string) {
    let that: any = this;
    if (that && that.commonComponentsDeclarations) {
      that = that.commonComponentsDeclarations;
    }
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.has的this不是Declarations');
    }
    return that.declarations.some(
      (item: { name: string; code: string }) => item.name === name,
    );
  },
  put(declarationData: { name: string; code: string }) {
    let that: any = this;
    if (that && that.commonComponentsDeclarations) {
      that = that.commonComponentsDeclarations;
    }
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.put的this不是Declarations');
    }
    if (!that.has(declarationData.name)) {
      that.declarations.push(declarationData);
    }
  },
  toString() {
    let that: any = this;
    if (that && that.commonComponentsDeclarations) {
      that = that.commonComponentsDeclarations;
    }
    if (!that || !Array.isArray(that.declarations)) {
      throw new Error('Declarations.toString的this不是Declarations');
    }
    return this.declarations.reduce(
      (string, declaration) => `${string}${declaration.code}`,
      '',
    );
  },
});

export const generateReactSourceCodeOfBackstage = (pageModel: PageModel) => {
  const componentName = createComponentName(pageModel.meta.key);

  const componentsDeclarations = createDeclarations();
  const commonComponentsDeclarations = createDeclarations();

  const { declarations, call } = astToReactNodeCodeOfBackstage(
    pageModel.view as NodeASTOfBackstage,
    componentsDeclarations,
    {
      idRef: { current: 0 },
      commonComponentsDeclarations,
    },
    true,
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

  ${commonComponentsDeclarations.declarations.reduce(
    (commonDeclarations, commonDeclaration) =>
      `${commonDeclarations}${commonDeclaration.code}`,
    '',
  )}
  
  ${declarations}

  const ${componentName} = () => {
    ${astToReactLogicCode(pageModel.logics)}

    return (${call})
  };

  const App = () => <StrictMode><ConfigProvider locale={zhCN}><${componentName} /></ConfigProvider></StrictMode>
  
  `;

  return reactCode;
};

export const generateReactSourceCodeOfFrontstage = (pageModel: PageModel) => {
  const componentName = createComponentName(pageModel.meta.key);

  const commonComponentsDeclarations: Declarations = {
    declarations: [],
    has(name: string) {
      let that: any = this;
      if (that && that.commonComponentsDeclarations) {
        that = that.commonComponentsDeclarations;
      }
      if (!that || !Array.isArray(that.declarations)) {
        throw new Error(
          'commonComponentsDeclarations.has的this不是commonComponentsDeclarations',
        );
      }
      return that.declarations.some(
        (item: { name: string; code: string }) => item.name === name,
      );
    },
    put(declarationData: { name: string; code: string }) {
      let that: any = this;
      if (that && that.commonComponentsDeclarations) {
        that = that.commonComponentsDeclarations;
      }
      if (!that || !Array.isArray(that.declarations)) {
        throw new Error(
          'commonComponentsDeclarations.put的this不是commonComponentsDeclarations',
        );
      }
      if (!that.has(declarationData.name)) {
        that.declarations.push(declarationData);
      }
    },
  };

  const { declarations, call } = astToReactNodeCodeOfFrontstage(
    pageModel.view as NodeASTOfFrontstage,
    [],
    {
      idRef: { current: 0 },
      commonComponentsDeclarations,
    },
  );

  const reactCode = `
  import { StrictMode, useState, useMemo, useRef, useEffect, useCallback, useContext } from 'react';
  import { createRoot } from 'react-dom/client';
  import { produce } from 'immer';
  import axios from 'axios';
  import styled from 'styled-components';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zh-cn');

  ${generateCommonCodeOfFrontstage()}

  ${commonComponentsDeclarations.declarations.reduce(
    (commonDeclarations, commonDeclaration) =>
      `${commonDeclarations}${commonDeclaration.code}`,
    '',
  )}
  
  const ${componentName} = () => {
    ${astToReactLogicCode(pageModel.logics)}
    
    ${declarations}

    return (${call})
  };

  const App = () => <StrictMode><${componentName} /></StrictMode>
  
  `;

  return reactCode;
};
