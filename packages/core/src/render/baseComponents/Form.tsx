import { FunctionComponent, useCallback, useContext } from 'react';
import { Button, Form as AntdForm } from 'antd';
import { Api, ComponentLevel, ComponentNames, OffsetConst } from 'types/types';
import { definePropertyOfName, definePropertyOfLevel, fetchByApiConfig, convertRelativeToAbsolute } from 'utils/index';
import useTree from 'hooks/useTree';
import { ModelTreeContext } from 'render/index';

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
  api: Api;
}

interface FormProps extends BasicFormProps, AdvancedFormProps {}

const BasicForm: FunctionComponent<BasicFormProps> = ({ children, buttonText, api }) => {
  const [modelTree] = useContext(ModelTreeContext);

  const { handleStateChange } = useTree({ effect: api?.effect });

  const handleClick = useCallback(() => {
    fetchByApiConfig(api, undefined, handleStateChange, undefined, modelTree);
  }, [api, handleStateChange, modelTree]);

  return (
    <AntdForm>
      {children}
      <Button
        onClick={handleClick}
        style={{
          marginTop: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
          marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
        }}
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
