import { FunctionComponent, useCallback, useContext, useState } from 'react';
import { Button as AntdButton } from 'antd';
import { Size, ButtonType, ComponentNames, Api, ComponentLevel } from 'types/types';
import { useTree } from 'hooks/index';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfLevel,
  definePropertyOfIdentifier,
  IDENTIFIER_REFRESH,
  executeFunction,
  verifyExecuteResult,
  fetchByApiConfig,
  readValueByPath,
} from 'utils/index';
import { ModelTreeContext } from 'render/index';

interface AdvancedButtonProps extends CommonProps {
  text: string;
  href?: string;
  target?: string;
  size?: Size;
  type?: ButtonType;
  value?: any;
  api: Api;
  refresh?: any;
}

interface ButtonProps extends AdvancedButtonProps {}

const AdvancedButton: FunctionComponent<ButtonProps> = ({
  text,
  href,
  size,
  target,
  type,
  state,
  model,
  effect,
  value,
  api,
  ioc,
  leftOffset,
  topOffset,
  computeData,
  refresh,
}) => {
  if (refresh) {
    definePropertyOfIdentifier(refresh, IDENTIFIER_REFRESH);
  }
  const { handleModelChange, handleStateChange, isShow } = useTree({ state, model, effect });
  const [modelTree] = useContext(ModelTreeContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    if (effect && ioc !== undefined) {
      const model = computeData ? executeFunction(computeData, ioc) : ioc;
      if (verifyExecuteResult(model)) {
        handleModelChange(model);
      } else {
        console.error('computeData occurred error in "button"');
      }
    }
    if (api) {
      const nodeModel = readValueByPath(model, api.effect);
      const originalParams = ioc !== undefined ? ioc : nodeModel && nodeModel[0];
      setIsLoading(true);
      fetchByApiConfig(api, originalParams, handleStateChange, undefined, modelTree)
        .finally(() => {
          setIsLoading(false);
        })
        .then(() => {
          handleStateChange(value, effect);
          if (refresh) {
            fetchByApiConfig(refresh, undefined, handleStateChange, undefined, modelTree, false);
          }
        });
    } else if (value !== undefined) {
      handleStateChange(value);
    }
  }, [handleStateChange, value, api, ioc, handleModelChange, effect, computeData, model, modelTree, refresh]);

  return isShow ? (
    <AntdButton
      loading={isLoading}
      href={href}
      target={target}
      size={size}
      type={type}
      onClick={handleClick}
      style={{ marginTop: convertRelativeToAbsolute(topOffset), marginLeft: convertRelativeToAbsolute(leftOffset) }}
    >
      {text}
    </AntdButton>
  ) : null;
};

const Button: FunctionComponent<ButtonProps> = (props) => {
  switch (props.level) {
    case ComponentLevel.ADVANCED:
      return <AdvancedButton {...props} />;
    default:
      return null;
  }
};

definePropertyOfName(Button, ComponentNames.BUTTON);
definePropertyOfLevel(Button, [ComponentLevel.ADVANCED]);

export default Button;
