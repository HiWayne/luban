import { FunctionComponent, useCallback, useState, useMemo } from 'react';
import { Button as AntdButton } from 'antd';
import { Size, ButtonType, ComponentNames, Api, ComponentLevel } from '@core/types/types';
import { useTree, useCustomLogic, useApi, useRenderEditableWrapper } from '@core/hooks/index';
import {
  convertRelativeToAbsolute,
  definePropertyOfName,
  definePropertyOfAliasName,
  definePropertyOfLevel,
  definePropertyOfIdentifier,
  IDENTIFIER_REFRESH,
  IDENTIFIER_INIT,
  executeFunction,
  verifyExecuteResult,
} from '@core/utils/index';

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

const AdvancedButton: FunctionComponent<ButtonProps> = (props) => {
  const {
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
    inject,
    leftOffset,
    topOffset,
    computeData,
    refresh,
    init,
    customLogic,
    renderEditableWrapper,
  } = props;
  if (refresh) {
    definePropertyOfIdentifier(refresh, IDENTIFIER_REFRESH);
  }
  if (init) {
    definePropertyOfIdentifier(init, IDENTIFIER_INIT);
  }
  const { handleModelChange, handleStateChange, isShow } = useTree({ state, model, effect });
  const [isLoading, setIsLoading] = useState(false);
  const handleCustomClick = useCustomLogic(customLogic);

  const fetchByApi = useApi({ api, originalParams: inject });
  const fetchByRefresh = useApi({ api: refresh, notify: false });
  const fetchByInit = useApi({ api: init, notify: false });

  const { extraStyleOfRoot, renderedEditable } = useRenderEditableWrapper(renderEditableWrapper, props);

  const handleClick = useCallback(() => {
    if (typeof handleCustomClick === 'function') {
      handleCustomClick();
      return;
    }
    if (effect && inject !== undefined) {
      const model = computeData ? executeFunction(computeData, inject) : inject;
      if (verifyExecuteResult(model)) {
        handleModelChange(model);
      } else {
        console.error('computeData occurred error in "button"');
      }
    }
    if (api) {
      setIsLoading(true);
      fetchByApi()
        .finally(() => {
          setIsLoading(false);
        })
        .then(() => {
          handleStateChange(value, effect);
          if (refresh) {
            fetchByRefresh();
          } else if (init) {
            fetchByInit();
          }
        });
    } else if (value !== undefined) {
      handleStateChange(value);
    }
  }, [
    handleStateChange,
    value,
    api,
    inject,
    handleModelChange,
    effect,
    computeData,
    refresh,
    init,
    fetchByApi,
    fetchByInit,
    fetchByRefresh,
    handleCustomClick,
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
      style={{
        marginTop: convertRelativeToAbsolute(topOffset),
        marginLeft: convertRelativeToAbsolute(leftOffset),
        ...extraStyleOfRoot,
      }}
    >
      {text}
      {renderedEditable}
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
definePropertyOfAliasName(Button, '按钮');
definePropertyOfLevel(Button, [ComponentLevel.ADVANCED]);

export default Button;
