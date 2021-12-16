import { FunctionComponent, useCallback, useContext, useState, useMemo } from 'react';
import { Button as AntdButton } from 'antd';
import { Size, ButtonType, ComponentNames, Api, ComponentLevel } from 'types/types';
import { useTree, useCustomClick } from 'hooks/index';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfLevel,
  definePropertyOfIdentifier,
  IDENTIFIER_REFRESH,
  IDENTIFIER_INIT,
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
  type?: ButtonType | string;
  value?: any;
  api: Api;
  refresh?: any;
  init?: any;
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
  init,
  onClick,
}) => {
  if (refresh) {
    definePropertyOfIdentifier(refresh, IDENTIFIER_REFRESH);
  }
  if (init) {
    definePropertyOfIdentifier(init, IDENTIFIER_INIT);
  }
  const { handleModelChange, handleStateChange, isShow } = useTree({ state, model, effect });
  const { nodeState: effectState } = useTree({ state: refresh?.effect });
  const [modelTree] = useContext(ModelTreeContext);
  const [isLoading, setIsLoading] = useState(false);
  const handlecustomClick = useCustomClick(onClick);
  const handleClick = useCallback(() => {
    if (typeof handlecustomClick === 'function') {
      handlecustomClick();
      return;
    }
    if (effect && ioc !== undefined) {
      const model = computeData ? executeFunction(computeData, ioc) : ioc;
      if (verifyExecuteResult(model)) {
        handleModelChange(model);
      } else {
        console.error('computeData occurred error in "button"');
      }
    }
    if (api) {
      const nodeModel = readValueByPath(modelTree, api.model);
      const originalParams = ioc !== undefined ? ioc : nodeModel && nodeModel[0];
      setIsLoading(true);
      fetchByApiConfig(api, originalParams, handleStateChange, undefined, modelTree)
        .finally(() => {
          setIsLoading(false);
        })
        .then(() => {
          handleStateChange(value, effect);
          if (refresh) {
            fetchByApiConfig(refresh, undefined, handleStateChange, effectState[0], modelTree, false);
          } else if (init) {
            fetchByApiConfig(init, undefined, handleStateChange, undefined, modelTree, false);
          }
        });
    } else if (value !== undefined) {
      handleStateChange(value);
    }
  }, [
    handleStateChange,
    value,
    api,
    ioc,
    handleModelChange,
    effect,
    computeData,
    modelTree,
    refresh,
    init,
    effectState,
  ]);

  // 在antd 4.0 之后，危险成为一种按钮属性而不是按钮类型
  const computedType = useMemo(() => (type === 'danger' ? undefined : type), [type]);
  const computedDanger = useMemo(() => (type === 'danger' ? true : undefined), [type]);

  return isShow ? (
    <AntdButton
      loading={isLoading}
      href={href}
      target={target}
      size={size}
      type={computedType as ButtonType}
      danger={computedDanger}
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
