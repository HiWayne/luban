import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { message, Modal } from 'antd';
import {
  getElementByLuBanId,
  getLuBanIdFromElement,
} from '@/backend/service/compileService/generateReactSourceCode/utils';
import { findConfigFromMap, findNodeASTById, setNodeASTMap } from '../utils';
import useStore from '@/frontend/store';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { NodeAST } from '@/frontend/types';
import { useModifyPage } from './useModifyPage';
import { getComponentOfNodeAST } from '../utils/operateNodeAST';

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

  const {
    addComponentFromInitial,
    removeComponent,
    moveComponent,
    copyComponentToParent,
  } = useModifyPage();

  const createComponentNameTag = useCallback((name: string) => {
    const div = document.createElement('div');
    div.className = 'name';
    div.innerHTML = name;
    return div;
  }, []);

  const createSetRootButton = useCallback((convergent: boolean = false) => {
    const div = document.createElement('div');
    div.className = 'root-setter';
    div.innerHTML = convergent ? '解除绑定' : '绑定子元素';
    if (convergent) {
      div.classList.add('root');
    }
    return div;
  }, []);

  const createCopyButton = useCallback(() => {
    const div = document.createElement('div');
    div.className = 'copy';
    div.innerHTML = '复制';
    return div;
  }, []);

  const createComponentDeleteButton = useCallback(() => {
    const div = document.createElement('div');
    div.className = 'delete';
    div.innerHTML = '删除';
    return div;
  }, []);

  const createParentSelectorButton = useCallback(() => {
    const div = document.createElement('div');
    div.className = 'parent-selector';
    div.innerHTML = '选中父组件';
    return div;
  }, []);

  const openSpecifyEditorPanel = useCallback((id: number) => {
    if (id !== null) {
      const component = getComponentOfNodeAST(id);
      if (component) {
        const initialConfig = findConfigFromMap(id);
        setCurrentChooseComponent({
          component: { ...component, id },
          config: initialConfig,
        });
      }
    }
  }, []);

  const hasHighLightElement = useCallback((targetElement: HTMLElement) => {
    if (targetElement) {
      const id = targetElement.getAttribute('id');
      const nameTag = targetElement.querySelector(`#${id} > .name`);
      if (nameTag) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);

  const hasShortcutsElement = useCallback((targetElement: HTMLElement) => {
    if (targetElement) {
      const id = targetElement.getAttribute('id');
      const setRootButton = targetElement.querySelector(
        `#${id} > .root-setter`,
      );
      const copyButton = targetElement.querySelector(`#${id} > .copy`);
      const deleteTag = targetElement.querySelector(`#${id} > .delete`);
      const parentSelector = targetElement.querySelector(
        `#${id} > .parent-selector`,
      );
      if (setRootButton || copyButton || deleteTag || parentSelector) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);

  const appendComponentNameTag = useCallback(
    (targetElement: HTMLElement, targetComponent: ToCComponent) => {
      const nameTag = createComponentNameTag(targetComponent.name);
      targetElement.appendChild(nameTag);
    },
    [],
  );

  const appendShortcutsButtons = useCallback(
    (targetElement: HTMLElement, targetComponent: ToCComponent) => {
      const id = getLuBanIdFromElement(targetElement);
      if (id !== null) {
        const nodeAST = findNodeASTById(id);
        const nodeASTType = nodeAST?.type;
        if (nodeASTType) {
          if (
            targetComponent &&
            targetComponent.name &&
            targetElement &&
            !targetComponent.emptyTag &&
            !hasShortcutsElement(targetElement)
          ) {
            const data = {
              ...targetComponent,
              id,
            };

            const setRootButton = createSetRootButton();
            setRootButton.addEventListener('click', (e) => {
              e.stopPropagation();
              const element = e.target as HTMLElement;
              const currentNodeAST = findNodeASTById(id);
              if (currentNodeAST) {
                const convergent = !currentNodeAST?.convergent;
                setNodeASTMap(id, { ...currentNodeAST, convergent });
                const text = convergent ? '解除绑定' : '绑定子元素';
                if (convergent) {
                  element.classList.add('root');
                } else {
                  element.classList.remove('root');
                }
                element.innerHTML = text;
              }
            });
            targetElement.appendChild(setRootButton);

            const copyButton = createCopyButton();
            copyButton.addEventListener('click', (e) => {
              e.stopPropagation();
              copyComponentToParent(id);
              const parentId = findNodeASTById(nodeAST.parent!)?.id;
              if (parentId) {
                openSpecifyEditorPanel(parentId);
              }
            });
            targetElement.appendChild(copyButton);

            const componentDeleteButton = createComponentDeleteButton();
            componentDeleteButton.addEventListener('click', (e) => {
              e.stopPropagation();
              Modal.confirm({
                title: '删除',
                content: `确定删除【${data.name}】组件吗`,
                onOk: () => {
                  removeComponent(data.id);
                },
              });
            });
            targetElement.appendChild(componentDeleteButton);

            const parentSelectorButton = createParentSelectorButton();
            parentSelectorButton.addEventListener('click', (e) => {
              e.stopPropagation();
              if (id !== null) {
                const parentId = nodeAST?.parent;
                if (parentId) {
                  openSpecifyEditorPanel(parentId);
                }
              }
            });
            targetElement.appendChild(parentSelectorButton);
          }
        }
      }
    },
    [],
  );

  const highLightComponent = useCallback((element: HTMLElement) => {
    element.classList.add('editor-highlight');
    const id = getLuBanIdFromElement(element);
    if (id !== null) {
      const targetComponent = getComponentOfNodeAST(id);
      if (
        targetComponent &&
        !targetComponent.emptyTag &&
        !hasHighLightElement(element)
      ) {
        appendComponentNameTag(element, targetComponent);
      }
    }
  }, []);

  const showShortCutsButtons = useCallback((element: HTMLElement) => {
    element.classList.add('editor-shortcuts');
    const id = getLuBanIdFromElement(element);
    if (id !== null) {
      const targetComponent = getComponentOfNodeAST(id);
      if (targetComponent && !targetComponent.emptyTag) {
        appendShortcutsButtons(element, targetComponent);
      }
    }
  }, []);

  const unHighLightComponent = useCallback((element: HTMLElement) => {
    element.classList.remove('editor-highlight');
  }, []);

  const hiddenShortCutsButtons = useCallback((element: HTMLElement) => {
    element.classList.remove('editor-shortcuts');
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
        let targetNodeAST: NodeAST;
        if (nodeAST?.convergent) {
          targetNodeAST = nodeAST;
        } else {
          const findNodeASTIsRoot = (_nodeAST: NodeAST): NodeAST | null => {
            if (_nodeAST.convergent) {
              return _nodeAST;
            } else {
              const parentId = _nodeAST.parent;
              if (parentId !== null) {
                const parentNodeAST = findNodeASTById(parentId);
                if (parentNodeAST) {
                  return findNodeASTIsRoot(parentNodeAST);
                } else {
                  return null;
                }
              }
              return null;
            }
          };
          targetNodeAST = findNodeASTIsRoot(nodeAST) || nodeAST;
        }
        const targetComponent = getComponentOfNodeAST(targetNodeAST.id);
        if (targetComponent) {
          draggedTargetRef.current = {
            nodeAST: targetNodeAST,
            component: targetComponent,
            element,
          };
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

  const onDragEnter = useCallback(function (
    this: HTMLElement,
    event: DragEvent,
  ) {
    event.stopPropagation();
    const element = this;
    highLightComponent(element);
  },
  []);

  const onDragLeave = useCallback(function (
    this: HTMLElement,
    event: DragEvent,
  ) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id && prevOpenedIdRef.current !== id) {
      unHighLightComponent(element);
    }
  },
  []);

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
          const targetComponent = getComponentOfNodeAST(draggedNodeAST.id);
          if (targetComponent) {
            moveComponent(draggedNodeAST, selfId);
            message.success(`成功移动【${targetComponent.name}】组件`, 2);
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
          const targetComponent = getComponentOfNodeAST(draggedNodeAST.id);
          if (targetComponent) {
            moveComponent(draggedNodeAST, id);
            message.success(`成功移动【${targetComponent.name}】组件`, 2);
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
    showShortCutsButtons(element);
  }, []);

  const onMouseOut = useCallback(function (this: HTMLElement, event: Event) {
    event.stopPropagation();
    const element = this;
    const id = getLuBanIdFromElement(element);
    if (id && prevOpenedIdRef.current !== id) {
      unHighLightComponent(element);
    }
    hiddenShortCutsButtons(element);
  }, []);

  useEffect(() => {
    const componentsWrapperElements = document.querySelectorAll(
      '[role="luban_component"]',
    );

    (componentsWrapperElements as NodeListOf<HTMLElement>).forEach(
      (element: HTMLElement, index) => {
        if (index === 0) {
          element.style.minWidth = '375px';
          element.style.minHeight = '90vh';
        } else if (element.tagName !== 'IMG') {
          const { width, height } = element.getBoundingClientRect();
          if (width <= 0) {
            element.style.minWidth = '100px';
          }
          if (height <= 0) {
            element.style.minHeight = '100px';
          }
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
      },
    );
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
    return () => {
      (componentsWrapperElements as NodeListOf<HTMLElement>).forEach(
        (element: HTMLElement) => {
          element.removeEventListener('click', onClick);
          element.removeEventListener('mouseover', onMouseOver);
          element.removeEventListener('mouseout', onMouseOut);
          element.removeEventListener('dragstart', onDragStart);
          element.removeEventListener('dragend', onDragEnd);
          element.removeEventListener('dragenter', onDragEnter);
          element.removeEventListener('dragleave', onDragLeave);
          element.removeEventListener('dragover', onDragOver);
          element.removeEventListener('drop', onDrop);
        },
      );
    };
  }, [update]);

  useEffect(() => {
    if (currentChooseComponent) {
      const currentId = currentChooseComponent.component.id;
      if (prevOpenedIdRef.current !== null) {
        const id = prevOpenedIdRef.current;
        if (id !== currentId) {
          const element = getElementByLuBanId(id) as HTMLElement;
          if (element) {
            unHighLightComponent(element);
          }
        }
      }
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
