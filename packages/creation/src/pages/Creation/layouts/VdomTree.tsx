import { FunctionComponent, useCallback, useContext, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import produce from 'immer';
import { clone } from 'ramda';
import { Tree } from 'antd';
import G6 from '@antv/g6';
import { vdomTree, components } from '../index';
import { Menu } from './Menus';
import { findVdomById, loop } from './Configure/index';

// 得到vdom中类children的属性名称
const getChildrenKey = (vdom: VDomNode): string => {
  if (!vdom) {
    return '';
  }
  switch (vdom.name) {
    case 'modal':
      return 'content';
    default:
      return 'children';
  }
};

interface VdomTreeProps {
  onSelect: Dispatch<SetStateAction<Menu>>;
  setCurrentVdom: Dispatch<SetStateAction<VDomNode>>;
}

const VdomTree: FunctionComponent<VdomTreeProps> = ({ onSelect, setCurrentVdom }) => {
  const [vdom, setVdom] = useContext(vdomTree);
  const dataComputedFromVdomTree = useMemo<{ id: string; children: VDomNode[] }>(() => {
    const clonedVdom = clone(vdom);
    loop(clonedVdom, (vdom, index) => {
      vdom[index] = {
        id: vdom[index].id + '',
        children: vdom[index].content ? vdom[index].content : [],
        label: vdom[index].name,
        originalData: vdom[index],
      };
    });
    return {
      id: 'root',
      children: clonedVdom,
    };
  }, [vdom]);

  useEffect(() => {
    const treeGraph = new G6.TreeGraph({
      container: 'container',
      width: 500,
      height: 500,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange(item, collapsed) {
              const icon = item ? item.get('group').findByClassName('collapse-icon') : null;
              if (collapsed && icon) {
                icon.attr('symbol', 'EXPAND_ICON');
              } else if (icon) {
                icon.attr('symbol', 'COLLAPSE_ICON');
              }
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      layout: {
        type: 'dendrogram',
        direction: 'RL', // H / V / LR / RL / TB / BT
        nodeSep: 50,
        rankSep: 100,
        radial: true,
      },
    });

    treeGraph.data(dataComputedFromVdomTree);
    treeGraph.render();
    treeGraph.on('drop', (e) => {
      console.log(e);
    });
  }, []);

  // modal的content可以看做children
  // const computeVdom = useMemo<VDomNode[]>(
  //   () =>
  //     produce(vdom, (draft) => {
  //       loop(draft, (vdom, index) => {
  //         vdom[index] = {
  //           children: vdom[index].content ? vdom[index].content : [],
  //           key: vdom[index].id,
  //           ...vdom[index],
  //         };
  //       });
  //     }),
  //   [vdom],
  // );

  const onDrop = useCallback(
    (info: { node: any; dragNode: any; dropPosition: number; dropToGap: any }) => {
      console.log(info);
      const dropKey = info.node.id; // 放
      const dragKey = info.dragNode.id; // 拖
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const newVdom = produce(vdom, (draft) => {
        // Find dragObject
        const dragObj = findVdomById(draft, dragKey, (arr, index) => {
          arr.splice(index, 1);
        });

        if (!info.dropToGap) {
          // Drop on the content
          findVdomById(draft, dropKey, (arr, index) => {
            const item = arr[index];
            const childrenKey = getChildrenKey(item);
            if (childrenKey) {
              item[childrenKey] = item[childrenKey] || [];
              // where to insert 示例添加到头部，可以是随意位置
              item[childrenKey].unshift(dragObj);
            }
          });
        } else if (
          getChildrenKey(info.node) &&
          (info.node[getChildrenKey(info.node)] || []).length > 0 && // Has children
          info.node.props.expanded && // Is expanded
          dropPosition === 1 // On the bottom gap
        ) {
          findVdomById(draft, dropKey, (arr, index) => {
            const item = arr[index];
            const childrenKey = getChildrenKey(item);
            if (childrenKey) {
              item[childrenKey] = item[childrenKey] || [];
              // where to insert 示例添加到头部，可以是随意位置
              item[childrenKey].unshift(dragObj);
              // in previous version, we use item.children.push(dragObj) to insert the
              // item to the tail of the children
            }
          });
        } else {
          let ar: VDomNode[] = [];
          let i: number = 0;
          findVdomById(draft, dropKey, (arr, index) => {
            ar = arr;
            i = index;
          });
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj as VDomNode);
          } else {
            ar.splice(i + 1, 0, dragObj as VDomNode);
          }
        }
      });

      setVdom(newVdom);
    },
    [vdom, setVdom],
  );

  return (
    <div id="container"></div>
    // <Tree
    //   treeData={computeVdom as any}
    //   draggable
    //   onDrop={onDrop}
    //   fieldNames={{ title: 'name', key: 'id' }}
    //   onSelect={
    //     ((_key: any, { selectedNodes }: { selectedNodes: VDomNode[] }) => {
    //       const menu = components.find((component) => component.key === selectedNodes[0].name);
    //       if (menu) {
    //         onSelect(menu);
    //         setCurrentVdom(selectedNodes[0]);
    //       }
    //     }) as any
    //   }
    // ></Tree>
  );
};

export default VdomTree;
