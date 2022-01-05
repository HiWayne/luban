import { FunctionComponent, useCallback, useMemo } from 'react';
import { Input as AntdInput, Form } from 'antd';
import {
  convertWidth,
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfAliasName,
  definePropertyOfLevel,
} from '@core/utils/index';
import { Size, ComponentNames, ComponentLevel, OffsetConst } from '@core/types/types';
import { useTree } from '@core/hooks/index';

const inputMap = {
  textarea: AntdInput.TextArea,
  password: AntdInput.Password,
};

interface AdvancedInputProps extends CommonProps {
  label: string;
  type?: string;
  width?: number | string;
  size?: Size;
  rules?: any[];
  labelWidth?: number;
  wrapperOffset?: number;
}

interface BasicInputProps {
  label: string;
  type?: string;
  model?: MaybeHasSubPath;
  width?: number | string;
  required?: boolean;
  size?: Size;
}

interface InputProps extends AdvancedInputProps, BasicInputProps {}

const AdvancedInput: FunctionComponent<AdvancedInputProps> = ({
  label,
  type,
  width,
  size = Size.middle,
  rules,
  model,
  state,
  effect,
  labelWidth,
  topOffset,
  leftOffset,
  wrapperOffset,
}) => {
  const widthHasUnit = useMemo(() => convertWidth(width), [width]);

  const { nodeModel, handleModelChange, handleStateChange, isShow } = useTree({
    state,
    model,
    effect,
  });
  const handleInputChange = useCallback(
    (e) => {
      handleModelChange(e);
      handleStateChange(e);
    },
    [handleModelChange, handleStateChange],
  );

  // @ts-ignore
  const ANTD_INPUT = type && inputMap[type] ? inputMap[type] : AntdInput;

  return isShow ? (
    <Form.Item
      label={label}
      rules={rules}
      labelCol={{ span: labelWidth }}
      wrapperCol={{ offset: wrapperOffset }}
      style={{ marginTop: convertRelativeToAbsolute(topOffset), marginLeft: convertRelativeToAbsolute(leftOffset) }}
    >
      <ANTD_INPUT
        value={nodeModel[0]}
        onChange={handleInputChange}
        size={size}
        style={widthHasUnit ? { width: widthHasUnit } : undefined}
      />
    </Form.Item>
  ) : null;
};

const BasicInput: FunctionComponent<BasicInputProps> = ({ label, type, model, width, required, size }) => {
  // @ts-ignore
  const ANTD_INPUT = type && inputMap[type] ? inputMap[type] : AntdInput;

  const widthHasUnit = useMemo(() => convertWidth(width), [width]);

  const { nodeModel, handleModelChange } = useTree({
    model,
  });

  return (
    <Form.Item
      label={label}
      style={{
        marginTop: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
        marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
      }}
      name={model as Path}
      rules={[{ required: !!required }]}
    >
      <ANTD_INPUT
        size={size}
        value={nodeModel[0]}
        onChange={handleModelChange}
        style={widthHasUnit ? { width: widthHasUnit } : undefined}
      />
    </Form.Item>
  );
};

// @ts-ignore
const Input: FunctionComponent<InputProps> = (props) => {
  switch (props.level) {
    case ComponentLevel.BASIC:
      return (
        <BasicInput
          label={props.label}
          type={props.label}
          model={props.model}
          width={props.width}
          required={props.required}
        />
      );
    case ComponentLevel.ADVANCED:
      return <AdvancedInput {...props} />;
    default:
      return null;
  }
};

definePropertyOfName(Input, ComponentNames.INPUT);
definePropertyOfAliasName(Input, '输入框');
definePropertyOfLevel(Input, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Input;
