import { FunctionComponent, useCallback } from 'react';
import { Button, Form as AntdForm } from 'antd';
import { Api, ComponentLevel, ComponentNames, OffsetConst } from '@core/types/types';
import {
  definePropertyOfName,
  definePropertyOfAliasName,
  definePropertyOfLevel,
  convertRelativeToAbsolute,
  definePropertyOfIdentifier,
  IDENTIFIER_INIT,
} from '@core/utils/index';
import { useApi, useRenderEditableWrapper } from '@core/hooks/index';

enum Layout {
  horizontal = 'horizontal',
  vertical = 'vertical',
  inline = 'inline',
}

interface AdvancedFormProps {
  layout?: Layout;
}

interface BasicFormProps extends CommonProps {
  buttonText?: string;
  api: Api | any;
}

interface FormProps extends BasicFormProps, AdvancedFormProps {}

const BasicForm: FunctionComponent<BasicFormProps> = ({ children, buttonText, api }) => {
  const fetchByApi = useApi({ api });

  const handleClick = useCallback(() => {
    definePropertyOfIdentifier(api, IDENTIFIER_INIT);
    fetchByApi();
  }, [api, fetchByApi]);

  return (
    <AntdForm>
      {children}
      <Button
        onClick={handleClick}
        style={{
          marginTop: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
          marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
        }}
        type="primary"
      >
        {buttonText || '查询'}
      </Button>
    </AntdForm>
  );
};

const Form: FunctionComponent<FormProps> = ({ layout, children, level, renderEditableWrapper, ...props }) => {
  const { extraStyleOfRoot, renderedEditable } = useRenderEditableWrapper(renderEditableWrapper, props);
  switch (level) {
    case ComponentLevel.BASIC:
      return (
        <div style={extraStyleOfRoot}>
          <BasicForm level={level} {...props}>
            {children}
          </BasicForm>
          {renderedEditable}
        </div>
      );
    case ComponentLevel.ADVANCED:
      return (
        <div style={extraStyleOfRoot}>
          <AntdForm layout={layout}>{children}</AntdForm>
          {renderedEditable}
        </div>
      );
    default:
      return null;
  }
};

definePropertyOfName(Form, ComponentNames.FORM);
definePropertyOfAliasName(Form, '表单容器');
definePropertyOfLevel(Form, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Form;
