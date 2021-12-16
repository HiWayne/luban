import { FunctionComponent, useCallback } from 'react';
import { Button, Form as AntdForm } from 'antd';
import { Api, ComponentLevel, ComponentNames, OffsetConst } from 'types/types';
import {
  definePropertyOfName,
  definePropertyOfLevel,
  convertRelativeToAbsolute,
  definePropertyOfIdentifier,
  IDENTIFIER_INIT,
} from 'utils/index';
import useApi from 'hooks/useApi';

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

const Form: FunctionComponent<FormProps> = ({ layout, children, level, ...props }) => {
  switch (level) {
    case ComponentLevel.BASIC:
      return (
        <BasicForm level={level} {...props}>
          {children}
        </BasicForm>
      );
    case ComponentLevel.ADVANCED:
      return <AntdForm layout={layout}>{children}</AntdForm>;
    default:
      return null;
  }
};

definePropertyOfName(Form, ComponentNames.FORM);
definePropertyOfLevel(Form, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Form;
