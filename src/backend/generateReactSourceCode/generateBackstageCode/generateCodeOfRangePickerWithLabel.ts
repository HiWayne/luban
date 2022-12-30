import { NodeAST, RangePickerWithLabelProps } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, getMemberVariablePath } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfRangePickerWithLabel = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const {
    label,
    name,
    value1,
    value2,
    setValue,
    defaultValue,
    format,
    placeholder,
  } = props as RangePickerWithLabelProps;

  const defaultValuePropCode = defaultValue
    ? {
        _builtInType: 'function',
        code: `[${defaultValue.reduce(
          (defaultValueCode, value, index) =>
            `${defaultValueCode}${
              index === 0 ? `dayjs("${value}")` : `, dayjs("${value}")`
            }`,
          '',
        )}]`,
      }
    : undefined;

  // value可能是xxx.xxx或xxx["xxx"]这样的成员变量，onChange时应该按同样的路径修改
  const memberVariablePath1 = getMemberVariablePath(value1);
  const memberVariablePath2 = getMemberVariablePath(value2);

  const onChangeCode = {
    _builtInType: 'function',
    code: `(dates, datesString) => {${setValue}(${
      memberVariablePath1 && memberVariablePath2
        ? `(state) => {
                const newData = produce(state, draft => {
                    draft${memberVariablePath1} = dates[0]
                    draft${memberVariablePath2} = dates[1]
                })
                return newData
        }`
        : memberVariablePath1 || memberVariablePath2
        ? `(() => {throw new Error('RangePicker的value1、value2必须是同一个对象中的属性')})()`
        : 'dates'
    })}`,
  };

  const componentName = `RangePickerWithLabel`;

  // rangePickerProps: value, defaultValue, format, placeholder, onChange
  const componentDeclaration = `const RangePickerWithLabel = ({ label, name, ...rangePickerProps }) => (<Form.Item label={label} name={name}><RangePicker {...rangePickerProps} /></Form.Item>);`;

  const componentCall = `<RangePickerWithLabel${generateCodeOfProp(
    'label',
    label,
  )}${generateCodeOfProp('name', name)}${generateCodeOfProp('value', [
    value1,
    value2,
  ])}${generateCodeOfProp(
    'defaultValue',
    defaultValuePropCode,
  )}${generateCodeOfProp('format', format)}${generateCodeOfProp(
    'placeholder',
    placeholder,
  )}${generateCodeOfProp('onChange', onChangeCode)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
