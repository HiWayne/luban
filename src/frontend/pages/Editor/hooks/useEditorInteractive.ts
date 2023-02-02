import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { message, Modal } from 'antd';
import { getLuBanIdFromElement } from '@/backend/service/compileService/generateReactSourceCode/utils';
import { findConfigFromMap, findNodeASTById } from '../utils';
import useStore from '@/frontend/store';
import { toCComponents } from '../ToCEditor';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { NodeAST } from '@/frontend/types';
import { useModifyPage } from './useModifyPage';

export const useEditorInteractive = (update: any) => {
  const setCurrentChooseComponent = useStore(
    (store) => store.editor.setCurrentChooseComponent,
  );
  const draggedTargetRef: MutableRefObject<{
    nodeAST?: NodeAST;
    component: ToCComponent;
    element: Element;
  } | null> = useRef(null);

  const { addComponentFromExist, addComponentFromInitial, removeComponent } =
    useModifyPage();

  const createComponentNameTag = useCallback((name: string) => {
    const div = document.createElement('div');
    div.className = 'name';
    div.innerHTML = name;
    return div;
  }, []);

  const createComponentDeleteTag = useCallback(() => {
    const div = document.createElement('div');
    div.className = 'delete';
    div.innerHTML = '删除';
    return div;
  }, []);

  const onDragStart = useCallback(function (
    this: HTMLElement,
    event: DragEvent,
    component?: ToCComponent,
  ) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id !== null) {
      const nodeAST = findNodeASTById(id);
      if (nodeAST) {
        const nodeASTType = nodeAST.type;
        if (nodeASTType) {
          const targetComponent: ToCComponent | undefined = toCComponents.find(
            (c) => c.type === nodeASTType,
          );
          if (targetComponent) {
            draggedTargetRef.current = {
              nodeAST,
              component: targetComponent,
              element,
            };
          }
        }
      }
    } else if (component) {
      draggedTargetRef.current = {
        component,
        element,
      };
    }
  },
  []);

  const onDragEnd = useCallback(() => {
    setTimeout(() => {
      draggedTargetRef.current = null;
    }, 200);
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const element = this;
    if (
      draggedTargetRef.current &&
      draggedTargetRef.current.element !== element
    ) {
      const id = getLuBanIdFromElement(element);
      if (id !== null) {
        const draggedNodeAST = draggedTargetRef.current.nodeAST;
        if (draggedNodeAST) {
          const nodeASTType = draggedNodeAST.type;
          if (nodeASTType) {
            const targetComponent: ToCComponent | undefined =
              toCComponents.find((c) => c.type === nodeASTType);
            if (targetComponent) {
              const config = findConfigFromMap(draggedNodeAST.id);
              removeComponent(draggedNodeAST.id);
              addComponentFromExist(draggedNodeAST, config, id);
              message.success(`成功移动【${targetComponent.name}】组件`, 2);
            }
          }
        } else {
          addComponentFromInitial(draggedTargetRef.current.component, id);
        }
        draggedTargetRef.current = null;
      }
    }
  }, []);

  const onClick = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id !== null) {
      const nodeAST = findNodeASTById(id);
      if (nodeAST) {
        const componentsCount = toCComponents.length;
        let component = null;
        for (let i = 0; i < componentsCount; i++) {
          if (toCComponents[i].type === nodeAST.type) {
            component = toCComponents[i];
            break;
          }
        }
        if (component) {
          const initialConfig = findConfigFromMap(id);
          setCurrentChooseComponent({
            component: { ...component, id },
            config: initialConfig,
          });
        }
      }
    }
  }, []);

  const appendHighLightTags = useCallback(
    (
      name: string,
      targetElement: HTMLElement,
      data: ToCComponent & { id: number },
    ) => {
      if (name && targetElement) {
        targetElement.appendChild(createComponentNameTag(name));
        const componentDeleteTag = createComponentDeleteTag();
        componentDeleteTag.addEventListener('click', (e) => {
          e.stopPropagation();
          Modal.confirm({
            title: '删除',
            content: `确定删除【${data.name}】组件吗`,
            onOk: () => {
              removeComponent(data.id);
            },
          });
        });
        targetElement.appendChild(componentDeleteTag);
      }
    },
    [],
  );

  const hasHighLightTags = useCallback((targetElement: HTMLElement) => {
    if (targetElement) {
      const nameTag = targetElement.querySelector('.name');
      const deleteTag = targetElement.querySelector('.delete');
      if (nameTag || deleteTag) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);

  const onMouseOver = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    element.classList.add('editor-highlight');
    if (!hasHighLightTags(element)) {
      const id = getLuBanIdFromElement(element);
      if (id !== null) {
        const nodeASTType = findNodeASTById(id)?.type;
        if (nodeASTType) {
          const targetComponent: ToCComponent | undefined = toCComponents.find(
            (component) => component.type === nodeASTType,
          );
          if (targetComponent) {
            appendHighLightTags(targetComponent!.name, element, {
              ...targetComponent,
              id,
            });
          }
        }
      }
    }
  }, []);

  const onMouseOut = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    element.classList.remove('editor-highlight');
  }, []);

  useEffect(() => {
    const componentsWrapperElements = document.querySelectorAll(
      '[role="luban_component"]',
    );
    (componentsWrapperElements as any).forEach((element: HTMLElement) => {
      const { width, height } = element.getBoundingClientRect();
      if (width <= 0) {
        element.style.minWidth = '100px';
      }
      if (height <= 0) {
        element.style.minHeight = '100px';
      }
      element.setAttribute('draggable', 'true');
      element.addEventListener('click', onClick);
      element.addEventListener('mouseover', onMouseOver);
      element.addEventListener('mouseout', onMouseOut);
      element.addEventListener('dragstart', onDragStart);
      element.addEventListener('dragend', onDragEnd);
      element.addEventListener('dragover', onDragOver);
      element.addEventListener('drop', onDrop);
    });
  }, [update]);

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
  };
};
