import { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Form, message, Modal } from 'antd';
import { isExist } from '@duitang/dt-base';
import { CurrentComponent } from '@/frontend/store/editor';
import { RenderConfig } from './components/RenderConfig';
import useStore from '@/frontend/store';
import { useEditorInteractive, useModifyPage } from '../../hooks';
import { AddDropArea } from './components';
import {
  findNodeASTById,
  findChildrenOfNodeAST,
  setNodeASTMap,
} from '../../utils';
import { Flex } from '@/frontend/components';
import { getElementByLuBanId } from '@/backend/service/compileService/generateReactSourceCode/utils';

export const ConfigPanel: FC<{
  data: { component: CurrentComponent; config: any } | null;
  onDrop: any;
}> = ({ data, onDrop }) => {
  const [show, setShow] = useState(false);
  const [convergent, setConvergent] = useState(false);

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
      const id = data.component.id;
      const currentNodeAST = findNodeASTById(id);
      if (currentNodeAST) {
        const _convergent = !!currentNodeAST?.convergent;
        setConvergent(_convergent);
      }
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
        {!data.component.leaf ? (
          <Button
            style={
              convergent
                ? {
                    marginRight: '12px',
                    backgroundColor: '#E6A23C',
                    color: '#fff',
                  }
                : { marginRight: '12px' }
            }
            onClick={() => {
              const id = data.component.id;
              const currentNodeAST = findNodeASTById(id);
              const element = getElementByLuBanId(id) as HTMLElement;
              if (element && currentNodeAST) {
                const _convergent = !currentNodeAST?.convergent;
                setNodeASTMap(id, {
                  ...currentNodeAST,
                  convergent: _convergent,
                });
                const text = _convergent ? '解除绑定' : '绑定子元素';
                setConvergent(_convergent);
                if (_convergent) {
                  element.classList.add('root');
                } else {
                  element.classList.remove('root');
                }
                element.innerHTML = text;
              }
            }}>
            {convergent ? '解除绑定' : '绑定子元素'}
          </Button>
        ) : null}
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
