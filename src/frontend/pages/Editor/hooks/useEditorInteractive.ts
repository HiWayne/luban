import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { message, Modal } from 'antd';
import {
  getElementByLuBanId,
  getLuBanIdFromElement,
} from '@/backend/service/compileService/generateReactSourceCode/utils';
import { findConfigFromMap, findNodeASTById } from '../utils';
import useStore from '@/frontend/store';
import { toCComponents } from '../ToCEditor';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { NodeAST } from '@/frontend/types';
import { useModifyPage } from './useModifyPage';

export const useEditorInteractive = (update: any) => {
  const { currentChooseComponent, setCurrentChooseComponent } = useStore(
    (store) => ({
      currentChooseComponent: store.editor.currentChooseComponent,
      setCurrentChooseComponent: store.editor.setCurrentChooseComponent,
    }),
    shallow,
  );
  const draggedTargetRef: MutableRefObject<{
    nodeAST?: NodeAST;
    component: ToCComponent;
    element: Element;
  } | null> = useRef(null);
  const prevOpenedIdRef = useRef<number | null>(null);

  const { addComponentFromInitial, removeComponent, moveComponent } =
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

  const createParentSelectorTag = useCallback(() => {
    const div = document.createElement('div');
    div.className = 'parent-selector';
    div.innerHTML = '选中父组件';
    return div;
  }, []);

  const openSpecifyEditorPanel = useCallback((id: number) => {
    if (id !== null) {
      const nodeAST = findNodeASTById(id);
      if (nodeAST) {
        const component = toCComponents.find(
          (toCComponent) => toCComponent.type === nodeAST.type,
        );
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

  const appendHighLightTags = useCallback((targetElement: HTMLElement) => {
    const id = getLuBanIdFromElement(targetElement);
    if (id !== null) {
      const nodeASTType = findNodeASTById(id)?.type;
      if (nodeASTType) {
        const targetComponent: ToCComponent | undefined = toCComponents.find(
          (component) => component.type === nodeASTType,
        );
        if (targetComponent) {
          if (targetComponent.name && targetElement) {
            const data = {
              ...targetComponent,
              id,
            };
            targetElement.appendChild(
              createComponentNameTag(targetComponent.name),
            );

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

            const parentSelectorTag = createParentSelectorTag();
            parentSelectorTag.addEventListener('click', (e) => {
              e.stopPropagation();
              if (id !== null) {
                const nodeAST = findNodeASTById(id);
                const parentId = nodeAST?.parent;
                if (parentId) {
                  openSpecifyEditorPanel(parentId);
                }
              }
            });
            targetElement.appendChild(parentSelectorTag);
          }
        }
      }
    }
  }, []);

  const hasHighLightTags = useCallback((targetElement: HTMLElement) => {
    if (targetElement) {
      const id = targetElement.getAttribute('id');
      const nameTag = targetElement.querySelector(`#${id} > .name`);
      const deleteTag = targetElement.querySelector(`#${id} > .delete`);
      const parentSelector = targetElement.querySelector(
        `#${id} > .parent-selector`,
      );
      if (nameTag && deleteTag && parentSelector) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);

  const highLightComponent = useCallback((element: HTMLElement) => {
    element.classList.add('editor-highlight');
    const id = getLuBanIdFromElement(element);
    if (id !== null) {
      const nodeASTType = findNodeASTById(id)?.type;
      if (nodeASTType) {
        const targetComponent: ToCComponent | undefined = toCComponents.find(
          (component) => component.type === nodeASTType,
        );
        if (targetComponent) {
          if (!targetComponent.noEditorTag && !hasHighLightTags(element)) {
            appendHighLightTags(element);
          }
        }
      }
    }
  }, []);

  const unHighLightComponent = useCallback((element: HTMLElement) => {
    element.classList.remove('editor-highlight');
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

  const onDragEnter = useCallback((event: DragEvent) => {
    const element = event.target as HTMLElement;
    highLightComponent(element);
  }, []);

  const onDragLeave = useCallback((event: DragEvent) => {
    const element = event.target as HTMLElement;
    unHighLightComponent(element);
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback(function (
    this: HTMLElement,
    event: Event,
    selfId?: number,
  ) {
    event.stopPropagation();
    event.preventDefault();
    const element = this;
    if (
      draggedTargetRef.current &&
      draggedTargetRef.current.element !== element
    ) {
      if (selfId) {
        const draggedNodeAST = draggedTargetRef.current.nodeAST;
        if (draggedNodeAST) {
          const nodeASTType = draggedNodeAST.type;
          if (nodeASTType) {
            const targetComponent: ToCComponent | undefined =
              toCComponents.find((c) => c.type === nodeASTType);
            if (targetComponent) {
              moveComponent(draggedNodeAST, selfId);
              message.success(`成功移动【${targetComponent.name}】组件`, 2);
            }
          }
        } else {
          addComponentFromInitial(draggedTargetRef.current.component, selfId);
        }
        draggedTargetRef.current = null;
        return;
      }

      const id = getLuBanIdFromElement(element);
      if (id !== null) {
        const draggedNodeAST = draggedTargetRef.current.nodeAST;
        if (draggedNodeAST) {
          const nodeASTType = draggedNodeAST.type;
          if (nodeASTType) {
            const targetComponent: ToCComponent | undefined =
              toCComponents.find((c) => c.type === nodeASTType);
            if (targetComponent) {
              moveComponent(draggedNodeAST, id);
              message.success(`成功移动【${targetComponent.name}】组件`, 2);
            }
          }
        } else {
          addComponentFromInitial(draggedTargetRef.current.component, id);
        }
        draggedTargetRef.current = null;
      }
    }
  },
  []);

  const onClick = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id) {
      openSpecifyEditorPanel(id);
    }
  }, []);

  const onMouseOver = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    highLightComponent(element);
  }, []);

  const onMouseOut = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id && prevOpenedIdRef.current !== id) {
      unHighLightComponent(element);
    }
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
      element.addEventListener('dragenter', onDragEnter);
      element.addEventListener('dragleave', onDragLeave);
      element.addEventListener('dragover', onDragOver);
      element.addEventListener('drop', onDrop);
    });
    const _currentChooseComponent =
      useStore.getState().editor.currentChooseComponent;
    if (_currentChooseComponent) {
      const currentId = _currentChooseComponent.component.id;
      const element = getElementByLuBanId(currentId) as HTMLElement;
      if (element) {
        prevOpenedIdRef.current = currentId;
        highLightComponent(element);
      }
    }
  }, [update]);

  useEffect(() => {
    if (currentChooseComponent) {
      const currentId = currentChooseComponent.component.id;
      const element = getElementByLuBanId(currentId) as HTMLElement;
      if (element) {
        prevOpenedIdRef.current = currentId;
        highLightComponent(element);
      }
    } else if (prevOpenedIdRef.current !== null) {
      const id = prevOpenedIdRef.current;
      prevOpenedIdRef.current = null;
      const element = getElementByLuBanId(id) as HTMLElement;
      if (element) {
        unHighLightComponent(element);
      }
    }
  }, [currentChooseComponent]);

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    openSpecifyEditorPanel,
  };
};
