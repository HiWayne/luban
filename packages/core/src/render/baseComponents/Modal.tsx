import { Modal as AntdModal } from 'antd';
import { FunctionComponent, useCallback } from 'react';
import { ComponentLevel, ComponentNames } from 'types/types';
import { definePropertyOfName, definePropertyOfLevel } from 'utils/index';
import Render from 'render/Render';
import { useTree } from 'hooks/index';

interface ModalProps extends CommonProps {
  title?: string;
  content: VDomNode[] | string;
  footer?: VDomNode[];
}

const Modal: FunctionComponent<ModalProps> = ({ title, content, footer: _footer, state, model, effect }) => {
  const children = content
    ? typeof content === 'string'
      ? content
      : Array.isArray(content)
      ? content.map((vdomNode) => <Render key={vdomNode.id} data={vdomNode} />)
      : null
    : null;
  const footer = Array.isArray(_footer)
    ? _footer.map((vdomNode) => <Render key={vdomNode.id} data={vdomNode} />)
    : undefined;

  const { handleStateChange, isShow } = useTree({ state, model, effect });

  const onCancel = useCallback(() => {
    handleStateChange(false);
  }, [handleStateChange]);

  return (
    <AntdModal visible={isShow} title={title} footer={footer} onCancel={onCancel}>
      {children}
    </AntdModal>
  );
};

definePropertyOfName(Modal, ComponentNames.MODAL);
definePropertyOfLevel(Modal, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Modal;
