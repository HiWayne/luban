import { NodeAST, InputWithLabelProps } from '@/backend/types/backstage';
import {
  createGenerateCodeFnReturn,
  getMemberVariablePath,
  isVariableName,
} from '../utils';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';

export const generateCodeOfInputWithLabel = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const {
    label,
    name,
    value,
    setValue,
    width,
    placeholder,
    size,
    defaultValue,
    disabled,
    maxLength,
    showCount,
  } = props as InputWithLabelProps;

  // value可能是xxx.xxx或xxx["xxx"]这样的成员变量，onChange时应该按同样的路径修改
  const memberVariablePath = getMemberVariablePath(value);

  const onChangeCode = isVariableName(value)
    ? {
        _builtInType: 'function',
        code: `(event) => {${setValue}(${
          memberVariablePath
            ? `(state) => {
                const newData = produce(state, draft => {
                    draft${memberVariablePath} = event.target.value
                })
                return newData
        }`
            : 'event.target.value'
        })
      }`,
      }
    : undefined;

  const componentName = `InputWithLabel`;

  // inputProps: style, placeholder, defaultValue, maxLength, value, showCount, size, disabled, onChange
  const componentDeclaration = `const InputWithLabel = ({ label, name, ...inputProps }) => (<Form.Item label={label} name={name}><Input {...inputProps} /></Form.Item>);`;

  const componentCall = `<InputWithLabel${generateCodeOfProp(
    'label',
    label,
  )}${generateCodeOfProp('name', name)}${generateCodeOfProp(
    'style',
    width ? { width: `${width}px` } : undefined,
  )}${generateCodeOfProp('placeholder', placeholder)}${generateCodeOfProp(
    'size',
    size,
  )}${generateCodeOfProp('defaultValue', defaultValue)}${generateCodeOfProp(
    'disabled',
    disabled,
  )}${generateCodeOfProp('maxLength', maxLength)}${generateCodeOfProp(
    'showCount',
    showCount,
  )}${generateCodeOfProp('value', value)}${generateCodeOfProp(
    'onChange',
    onChangeCode,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
