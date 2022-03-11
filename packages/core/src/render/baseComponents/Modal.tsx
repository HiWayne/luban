import { Modal as AntdModal } from 'antd';
import { FunctionComponent, useCallback } from 'react';
import { ComponentLevel, ComponentNames } from '@core/types/types';
import { definePropertyOfName, definePropertyOfAliasName, definePropertyOfLevel } from '@core/utils/index';
import Render from '../../render/Render';
import { useRenderEditableWrapper, useTree } from '@core/hooks/index';
import { styleWithoutShapeInEditMode } from '@core/styles/index';

interface ModalProps extends CommonProps {
  title?: string;
  content: VDomNode[] | string;
  footer?: VDomNode[];
}

const Modal: FunctionComponent<ModalProps> = (props) => {
  const { title, content, footer, state, model, effect, hierarchicalRecords, renderEditableWrapper, _editable } = props;
  const contentChildren = content
    ? Array.isArray(content)
      ? content.map((vdomNode, index) => {
          const hierarchicalRecordsOfThis = [...hierarchicalRecords, 'content', index];
          return (
            <Render
              key={vdomNode.id}
              data={{ ...vdomNode, hierarchicalRecords: hierarchicalRecordsOfThis }}
              editable={_editable}
            />
          );
        })
      : null
    : null;
  const footerChildren = Array.isArray(footer)
    ? footer.map((vdomNode, index) => {
        const hierarchicalRecordsOfThis = [...hierarchicalRecords, 'footer', index];
        return (
          <Render
            key={vdomNode.id}
            data={{ ...vdomNode, hierarchicalRecords: hierarchicalRecordsOfThis }}
            editable={_editable}
          />
        );
      })
    : undefined;

  const { handleStateChange, isShow } = useTree({ state, model, effect });

  const { extraStyleOfRoot, renderedEditable } = useRenderEditableWrapper(renderEditableWrapper, props);

  const onCancel = useCallback(() => {
    handleStateChange(false);
  }, [handleStateChange]);

  return _editable ? (
    <>
      <div
        style={{
          ...styleWithoutShapeInEditMode,
          ...extraStyleOfRoot,
        }}
        onClick={() => {
          handleStateChange(true);
        }}
      >
        modal(点击展开)
        {renderedEditable}
      </div>
      {isShow ? (
        <AntdModal
          visible={isShow}
          title={title}
          footer={footerChildren}
          onCancel={() => {
            handleStateChange(false);
          }}
        >
          {contentChildren}
        </AntdModal>
      ) : null}
    </>
  ) : (
    <AntdModal visible={isShow} title={title} footer={footerChildren} onCancel={onCancel}>
      {contentChildren}
    </AntdModal>
  );
};

definePropertyOfName(Modal, ComponentNames.MODAL);
definePropertyOfAliasName(Modal, '弹窗');
definePropertyOfLevel(Modal, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default Modal;
