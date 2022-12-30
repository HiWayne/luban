import {
  CheckboxGroupWithLabelProps,
  NodeAST,
} from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, getMemberVariablePath } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfCheckboxGroupWithLabel = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const { label, name, options, value, setValue, defaultValue } =
    props as CheckboxGroupWithLabelProps;

  // value可能是xxx.xxx或xxx["xxx"]这样的成员变量，onChange时应该按同样的路径修改
  const memberVariablePath = getMemberVariablePath(value);

  const onChangeCode = {
    _builtInType: 'function',
    code: `(value) => {${setValue}(${
      memberVariablePath
        ? `(state) => {
                const newData = produce(state, draft => {
                    draft${memberVariablePath} = value
                })
                return newData
        }`
        : 'value'
    })}`,
  };

  const componentName = `CheckboxGroupWithLabel`;

  // checkboxGroupProps: value, defaultValue, onChange, options
  const componentDeclaration = `const CheckboxGroupWithLabel = ({ label, name, ...checkboxGroupProps }) => (<Form.Item label={label} name={name}><Checkbox.Group {...checkboxGroupProps} /></Form.Item>);`;

  const componentCall = `<CheckboxGroupWithLabel${generateCodeOfProp(
    'label',
    label,
  )}${generateCodeOfProp('name', name)}${generateCodeOfProp(
    'value',
    value,
  )}${generateCodeOfProp('defaultValue', defaultValue)}${generateCodeOfProp(
    'onChange',
    onChangeCode,
  )}${generateCodeOfProp('options', options)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
