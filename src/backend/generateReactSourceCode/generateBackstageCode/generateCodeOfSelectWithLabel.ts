import { NodeAST, SelectWithLabelProps } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, getMemberVariablePath } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfSelectWithLabel = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const { label, name, width, options, value, setValue, defaultValue } =
    props as SelectWithLabelProps;

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

  const componentName = `SelectWithLabel`;

  // selectProps: style, options, value, defaultValue, onChange
  const componentDeclaration = `const SelectWithLabel = ({ label, name, ...selectProps }) => (<Form.Item label={label} name={name}><Select {...selectProps} /></Form.Item>);`;

  const componentCall = `<SelectWithLabel${generateCodeOfProp(
    'label',
    label,
  )}${generateCodeOfProp('name', name)}${generateCodeOfProp(
    'style',
    width ? { width } : undefined,
  )}${generateCodeOfProp('options', options)}${generateCodeOfProp(
    'value',
    value,
  )}${generateCodeOfProp('defaultValue', defaultValue)}${generateCodeOfProp(
    'onChange',
    onChangeCode,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
