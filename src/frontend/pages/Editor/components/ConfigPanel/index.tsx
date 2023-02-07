import { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Form, message, Modal } from 'antd';
import { isExist } from '@duitang/dt-base';
import { CurrentComponent } from '@/frontend/store/editor';
import { RenderConfig } from './components/RenderConfig';
import useStore from '@/frontend/store';
import { useEditorInteractive, useModifyPage } from '../../hooks';
import { AddDropArea } from './components';
import { findNodeASTById } from '../../utils';
import { Flex } from '@/frontend/components';
import { findChildrenOfNodeAST } from '../../utils/operateNodeAST';

export const ConfigPanel: FC<{
  data: { component: CurrentComponent; config: any } | null;
  onDrop: any;
}> = ({ data, onDrop }) => {
  const [show, setShow] = useState(false);

  const { removeComponent, copyComponentToParent } = useModifyPage();

  const { openSpecifyEditorPanel } = useEditorInteractive(1);

  const onClose = useCallback(() => {
    useStore.getState().editor.setCurrentChooseComponent(null);
    setShow(false);
  }, []);

  const onDelete = useCallback(() => {
    Modal.confirm({
      title: '删除',
      content: `确定删除【${data?.component.name}】组件吗`,
      onOk: () => {
        if (isExist(data?.component.id)) {
          removeComponent(data?.component.id as number);
          onClose();
        }
      },
    });
  }, [data?.component.id]);

  useEffect(() => {
    if (!data) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [data]);

  return data ? (
    <Drawer
      title={data.component.name}
      width={500}
      open={show}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      mask={false}>
      {data.component.leaf ? null : (
        <AddDropArea id={data.component.id} onDrop={onDrop} />
      )}
      {data.component.emptyTag ? (
        <Flex style={{ marginBottom: '12px' }}>
          <Button
            type="primary"
            style={{ marginRight: '12px' }}
            onClick={() => {
              const id = data.component.id;
              const nodeAST = findNodeASTById(id);
              if (nodeAST) {
                copyComponentToParent(id);
                const parent = findNodeASTById(nodeAST.parent!);
                if (parent) {
                  const children = findChildrenOfNodeAST(parent);
                  console.log(parent)
                  if (children) {
                    const lastChild = children[children.length - 1];
                    if (lastChild) {
                      openSpecifyEditorPanel(lastChild.id);
                    }
                  }
                }
              } else {
                message.error('复制失败，组件不存在', 2);
              }
            }}>
            复制
          </Button>
          <Button
            onClick={() => {
              const nodeAST = findNodeASTById(data.component.id);
              if (nodeAST) {
                const parentId = nodeAST.parent;
                if (parentId) {
                  openSpecifyEditorPanel(parentId);
                }
              }
            }}>
            选中父组件
          </Button>
        </Flex>
      ) : null}
      <Form labelCol={{ span: 7 }} labelAlign="left">
        {data.component.configs.map((config, index) => (
          <RenderConfig
            key={config.name}
            data={data.component}
            initialConfig={data.config}
            index={index}
          />
        ))}
      </Form>
      <Button danger onClick={onDelete}>
        删除
      </Button>
    </Drawer>
  ) : null;
};
