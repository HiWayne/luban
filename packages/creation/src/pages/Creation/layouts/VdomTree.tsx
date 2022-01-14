import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import produce from 'immer';
import { clone } from 'ramda';
import { Tree } from 'antd';
import G6 from '@antv/g6';
import { vdomTree, components } from '../index';
import { Menu } from './Menus';
import { findVdomById, loop } from './Configure/index';

const WIDTH = 750;
const HEIGHT = 650;

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
  const containerRef = useRef(null);
  const treeGraphRef = useRef(null);
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
      label: 'root',
      children: clonedVdom,
    };
  }, [vdom]);

  useEffect(() => {
    if (!treeGraphRef.current) {
      treeGraphRef.current = new G6.TreeGraph({
        container: containerRef.current,
        width: WIDTH,
        height: HEIGHT,
        modes: {
          default: [
            // {
            //   type: 'collapse-expand',
            //   onChange(item, collapsed) {
            //     const icon = item ? item.get('group').findByClassName('collapse-icon') : null;
            //     if (collapsed && icon) {
            //       icon.attr('symbol', 'EXPAND_ICON');
            //     } else if (icon) {
            //       icon.attr('symbol', 'COLLAPSE_ICON');
            //     }
            //   },
            // },
            'drag-canvas',
            'zoom-canvas',
            'drag-node',
          ],
        },
        defaultEdge: {
          shape: 'cubic-horizontal',
          style: {
            stroke: '#A3B1BF',
          },
        },
        defaultNode: {
          type: 'rect',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
              color: '#409eff',
            },
          },
          style: {
            stroke: '#c6e2ff',
            width: 100,
          },
        },
        layout: {
          type: 'dendrogram',
          direction: 'LR', // H / V / LR / RL / TB / BT
          nodeSep: 50,
          rankSep: 200,
        },
      });
      const treeGraph = treeGraphRef.current;
      treeGraph.data(dataComputedFromVdomTree);
      treeGraph.render();
      treeGraph.moveTo(WIDTH * 0.1, HEIGHT * 0.1);
      treeGraph.on('dragnodeend', (e) => {
        console.log('drag', e.items[0]);
        console.log('drop', e.targetItem);
      });
    } else {
      // 当vdom改变时仅更新treeGraph
      const treeGraph = treeGraphRef.current;
      treeGraph.changeDate(dataComputedFromVdomTree);
    }
  }, [dataComputedFromVdomTree]);

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
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '65px',
        left: '295px',
        fontSize: '0',
        zIndex: '999',
        background: 'rgba(255, 255, 255, 0.8)',
      }}
    ></div>
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
