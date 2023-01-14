import { NodeAST, RadioGroupWithLabelProps } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, getMemberVariablePath } from '../utils';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';

export const generateCodeOfRadioGroupWithLabel = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const { label, name, options, direction, value, setValue, defaultValue } =
    props as RadioGroupWithLabelProps;

  // value可能是xxx.xxx或xxx["xxx"]这样的成员变量，onChange时应该按同样的路径修改
  const memberVariablePath = getMemberVariablePath(value);

  const onChangeCode = {
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
    })}`,
  };

  const componentName = `RadioGroupWithLabel`;

  // radioGroupProps: value, defaultValue, onChange
  const componentDeclaration = `const RadioGroupWithLabel = ({ label, name, direction, children, ...radioGroupProps }) => (<Form.Item label={label} name={name}><Radio.Group {...radioGroupProps}><Space direction={direction}>{children}</Space></Radio.Group></Form.Item>);`;

  const componentCall = `<RadioGroupWithLabel${generateCodeOfProp(
    'label',
    label,
  )}${generateCodeOfProp('name', name)}${generateCodeOfProp(
    'value',
    value,
  )}${generateCodeOfProp('defaultValue', defaultValue)}${generateCodeOfProp(
    'onChange',
    onChangeCode,
  )}${generateCodeOfProp('direction', direction)}>${options.reduce(
    (radiosCode, option) =>
      `${radiosCode}<Radio${generateCodeOfProp('value', option.value)}>${
        option.label
      }</Radio>`,
    '',
  )}</RadioGroupWithLabel>`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
