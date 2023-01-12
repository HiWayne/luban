import { FC, useCallback } from 'react';
import { Checkbox, Form, Input, Radio, Select, Switch } from 'antd';
import { debounce } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { ToCComponent } from '../../../config';
import { ColorPicker } from '../../configComponents/ColorPicker';
import { CustomStyleConfig } from '../../configComponents/CustomStyleConfig';
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
import { findConfigFromMap } from '../../../utils';
import { useUpdateNodeAST } from '../../../hooks/useUpdateNodeAST';

export const RenderConfig: FC<{
  data: ToCComponent & { id: number };
  index: number;
}> = ({ data, index }) => {
  const { id, configs } = data;
  const { formSchema, FormComponent, name, description, propName } =
    configs[index];

  const { updateNodeAST } = useUpdateNodeAST(data);

  const updateNodeASTWithDebounce = debounce(updateNodeAST, 1000);

  const initialConfig = findConfigFromMap(id);

  const computeNewData = useCallback((old?: Record<string, any>) => {
    if (old && old[propName]) {
      old[propName] = undefined;
    }
    return old;
  }, []);

  if (FormComponent) {
    return <FormComponent />;
  } else if (formSchema) {
    let formItemContent = null;
    switch (formSchema.type) {
      case 'input':
        formItemContent = (
          <Input
            key={id}
            defaultValue={initialConfig[propName]}
            onChange={(e) => {
              const value = e.target.value;
              updateNodeASTWithDebounce(
                id,
                { [propName]: value },
                { [propName]: value },
              );
            }}
          />
        );
        break;
      case 'select':
        formItemContent = (
          <Select
            key={id}
            defaultValue={initialConfig[propName]}
            options={formSchema.options}
            onChange={(value) => {
              updateNodeASTWithDebounce(
                id,
                { [propName]: value },
                { [propName]: value },
              );
            }}
          />
        );
        break;
      case 'radio':
        formItemContent = (
          <Radio.Group
            key={id}
            defaultValue={initialConfig[propName]}
            onChange={(e) => {
              const value = e.target.value;
              updateNodeASTWithDebounce(
                id,
                { [propName]: value },
                { [propName]: value },
              );
            }}>
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
          <Flex key={id}>
            <span style={{ marginRight: '4px' }}>否</span>
            <Switch
              defaultChecked={initialConfig[propName]}
              onChange={(value) => {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: value },
                  { [propName]: value },
                );
              }}
            />
            <span style={{ marginLeft: '4px' }}>是</span>
          </Flex>
        );
        break;
      case 'checkbox':
        formItemContent = (
          <Checkbox.Group
            key={id}
            defaultValue={initialConfig[propName]}
            onChange={(value) => {
              updateNodeASTWithDebounce(
                id,
                { [propName]: value },
                { [propName]: value },
              );
            }}>
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
            key={id}
            defaultValue={
              (initialConfig[propName] as LengthStyleConfig)?.value || undefined
            }
            defaultUnit={(initialConfig[propName] as LengthStyleConfig)?.unit}
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData.style },
                  { [propName]: changeData.styleConfig },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'color-picker':
        formItemContent = (
          <ColorPicker
            key={id}
            defaultColor={initialConfig[propName]}
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData },
                  { [propName]: changeData },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'css-margin':
        formItemContent = (
          <MarginCssConfig
            key={id}
            defaultTab={(initialConfig[propName] as MarginStyleConfig)?.tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig)?.singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig)?.singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig)?.topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig)?.topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig)?.leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig)?.leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig)?.bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig)?.bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig)?.rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig)?.rightUnit
            }
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData.style },
                  { [propName]: changeData.styleConfig },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'css-padding':
        formItemContent = (
          <MarginCssConfig
            key={id}
            defaultTab={(initialConfig[propName] as MarginStyleConfig)?.tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig)?.singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig)?.singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig)?.topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig)?.topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig)?.leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig)?.leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig)?.bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig)?.bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig)?.rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig)?.rightUnit
            }
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData.style },
                  { [propName]: changeData.styleConfig },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'css-border-radius':
        formItemContent = (
          <MarginCssConfig
            key={id}
            defaultTab={(initialConfig[propName] as MarginStyleConfig)?.tab}
            defaultValue={
              (initialConfig[propName] as MarginStyleConfig)?.singleValue
            }
            defaultUnit={
              (initialConfig[propName] as MarginStyleConfig)?.singleUnit
            }
            defaultTopValue={
              (initialConfig[propName] as MarginStyleConfig)?.topValue
            }
            defaultTopUnit={
              (initialConfig[propName] as MarginStyleConfig)?.topUnit
            }
            defaultLeftValue={
              (initialConfig[propName] as MarginStyleConfig)?.leftValue
            }
            defaultLeftUnit={
              (initialConfig[propName] as MarginStyleConfig)?.leftUnit
            }
            defaultBottomValue={
              (initialConfig[propName] as MarginStyleConfig)?.bottomValue
            }
            defaultBottomUnit={
              (initialConfig[propName] as MarginStyleConfig)?.bottomUnit
            }
            defaultRightValue={
              (initialConfig[propName] as MarginStyleConfig)?.rightValue
            }
            defaultRightUnit={
              (initialConfig[propName] as MarginStyleConfig)?.rightUnit
            }
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData.style },
                  { [propName]: changeData.styleConfig },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'custom-style':
        formItemContent = (
          <CustomStyleConfig
            key={id}
            defaultStyleConfig={initialConfig[propName]}
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData.style },
                  { [propName]: changeData.styleConfig },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'variable-select':
        formItemContent = (
          <VariableSelect
            key={id}
            scopeIndex={0}
            defaultVariableName={initialConfig[propName]}
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData },
                  { [propName]: changeData },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
        break;
      case 'image-upload':
        formItemContent = (
          <UploadImageConfig
            key={id}
            defaultUrl={initialConfig[propName]}
            onChange={(changeData) => {
              if (changeData) {
                updateNodeASTWithDebounce(
                  id,
                  { [propName]: changeData },
                  { [propName]: changeData },
                );
              } else {
                updateNodeASTWithDebounce(id, computeNewData, computeNewData);
              }
            }}
          />
        );
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
