import { Children, CSSProperties, FC } from 'react';
import { Checkbox, Form, Input, Radio, Select, Switch } from 'antd';
import { Flex } from '@/frontend/components';
import { Config } from '../../../config';
import { ColorPicker } from '../../configComponents/ColorPicker';
import {
  CustomStyleConfig,
  CustomStyleConfigData,
  PositionStyleConfig,
} from '../../configComponents/CustomStyleConfig';
import {
  LengthCssConfig,
  LengthStyleConfig,
} from '../../configComponents/LengthCssConfig';
import {
  MarginCssConfig,
  MarginStyleConfig,
} from '../../configComponents/MarginCssConfig';
import { VariableSelect } from '../../configComponents/VariableSelect';
import { UploadImageConfig } from '../../configComponents/UploadImageConfig';
import { useFindConfig } from '../hooks';
import { NodeAST } from '@/backend/types/frontstage';

interface ConfigMap {
  margin: MarginStyleConfig;
  padding: MarginStyleConfig;
  borderRadius: MarginStyleConfig;
  position: PositionStyleConfig;
  customStyle: CustomStyleConfigData;
  backgroundColor: string;
  backgroundImage: string;
  width: LengthStyleConfig;
  height: LengthStyleConfig;
  backgroundRepeat: boolean;
  fontSize: LengthStyleConfig;
  lineHeight: LengthStyleConfig;
  fontFamily: string;
  textDecoration: string;
  textAlign: string;
  layout: string;
  data: string;
  'renderItem.iterate_scope_variable': string;
}

const createHandleChange =
  (
    id: number,
    propName: string,
    setConfigContext: (context: any) => void,
    setNodeASTTree: (tree: any) => void,
  ) =>
  (
    data:
      | {
          style: CSSProperties;
          styleConfig:
            | CustomStyleConfigData
            | MarginStyleConfig
            | PositionStyleConfig;
        }
      | string[]
      | string
      | null,
  ) => {
    let config: any;
    if (typeof data === 'string') {
      config = data;
    } else if (data && (data as any).styleConfig) {
      config = (data as any).styleConfig;
    } else {
      config = null;
    }
    setConfigContext((oldConfigContext: any) => {
      const newConfigContext = { ...oldConfigContext };
      if (newConfigContext[id]) {
        newConfigContext[id] = { ...newConfigContext[id], [propName]: config };
      } else {
        newConfigContext[id] = {};
        newConfigContext[id][propName] = config;
      }
      return newConfigContext;
    });
    const findNode = (
      nodeAST: NodeAST,
      nodeId: number,
      nodes?: NodeAST[],
    ): { complete: boolean; nodes: NodeAST[] } => {
      if (!nodes) {
        nodes = [];
      }
      const currentNodes = [...nodes];
      if (nodeAST.id === nodeId) {
        currentNodes.unshift(nodeAST);
        return { complete: true, nodes: currentNodes };
      } else {
        if (Array.isArray(nodeAST.children) && nodeAST.children.length > 0) {
          currentNodes.unshift(nodeAST);
          const childrenLength = nodeAST.children.length;
          for (let i = 0; i < childrenLength; i++) {
            const result = findNode(nodeAST.children[i], nodeId, currentNodes);
            if (result.complete) {
              return result;
            }
          }
          return { complete: false, nodes: currentNodes };
        }
        return { complete: false, nodes: currentNodes };
      }
    };
    setNodeASTTree((oldTree: NodeAST) => {
      const newTree = { ...oldTree };
      const { complete, nodes } = findNode(newTree, id);
      if (complete) {
        nodes[0].props = {
          ...nodes[0].props,
          [propName]: data && (data as any).style ? (data as any).style : data,
        };
        return newTree;
      } else {
        return oldTree;
      }
    });
  };

export const RenderConfig: FC<{ id: number; config: Config }> = ({
  id,
  config,
}) => {
  const { formSchema, FormComponent, name, description, propName } = config;

  const initialConfig = useFindConfig(id);

  if (FormComponent) {
    return <FormComponent />;
  } else if (formSchema) {
    let formItemContent = null;
    switch (formSchema.type) {
      case 'input':
        formItemContent = <Input defaultValue={initialConfig[propName]} />;
        break;
      case 'select':
        formItemContent = (
          <Select
            defaultValue={initialConfig[propName]}
            options={formSchema.options}
          />
        );
        break;
      case 'radio':
        formItemContent = (
          <Radio.Group defaultValue={initialConfig[propName]}>
            {formSchema.options!.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );
        break;
      case 'switch':
        formItemContent = (
          <Flex>
            <span style={{ marginRight: '4px' }}>否</span>
            <Switch defaultChecked={initialConfig[propName]} />
            <span style={{ marginLeft: '4px' }}>是</span>
          </Flex>
        );
        break;
      case 'checkbox':
        formItemContent = (
          <Checkbox.Group defaultValue={initialConfig[propName]}>
            {formSchema.options!.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
        break;
      case 'css-length':
        formItemContent = (
          <LengthCssConfig
            defaultValue={
              (initialConfig[propName] as LengthStyleConfig).value || 0
            }
            defaultTab={(initialConfig[propName] as LengthStyleConfig).tab}
            defaultUnit={(initialConfig[propName] as LengthStyleConfig).unit}
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'color-picker':
        formItemContent = (
          <ColorPicker
            defaultColor={initialConfig[propName]}
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'css-margin':
        formItemContent = (
          <MarginCssConfig
            defaultTab={(initialConfig[propName] as MarginStyleConfig).tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig).singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig).singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig).topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig).topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig).leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig).leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig).bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig).bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig).rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig).rightUnit
            }
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'css-padding':
        formItemContent = (
          <MarginCssConfig
            defaultTab={(initialConfig[propName] as MarginStyleConfig).tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig).singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig).singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig).topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig).topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig).leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig).leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig).bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig).bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig).rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig).rightUnit
            }
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'css-border-radius':
        formItemContent = (
          <MarginCssConfig
            defaultTab={(initialConfig[propName] as MarginStyleConfig).tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig).singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig).singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig).topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig).topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig).leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig).leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig).bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig).bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig).rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig).rightUnit
            }
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'custom-style':
        formItemContent = (
          <CustomStyleConfig
            defaultStyleConfig={initialConfig[propName]}
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'variable-select':
        formItemContent = (
          <VariableSelect
            scopeIndex={0}
            defaultVariableName={initialConfig[propName]}
            onChange={(value) => {
              console.log(value);
            }}
          />
        );
        break;
      case 'image-upload':
        formItemContent = <UploadImageConfig onChange={console.log} />;
        break;
      default:
        formItemContent = null;
    }
    return (
      <Form.Item label={<h4>{name}</h4>} tooltip={description}>
        {formItemContent}
      </Form.Item>
    );
  } else {
    return null;
  }
};
