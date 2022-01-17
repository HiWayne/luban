import { CSSProperties, FunctionComponent, useEffect, useRef } from 'react';
import { TreeGraph } from '@antv/g6';
import { GraphData, TreeGraphData } from '@antv/g6-core';

class Position {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  constructor([centerX = 0, centerY = 0] = [], [width = 0, height = 0] = []) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
  }
}

interface TreeProps {
  width: number;
  height: number;
  data: GraphData | TreeGraphData;
  initialX: number;
  initialY: number;
  style: CSSProperties;
}

const Tree: FunctionComponent<TreeProps> = ({
  width = 750,
  height = 650,
  data,
  initialX = 750 * 0.1,
  initialY = 650 * 0.1,
  style,
}) => {
  const containerRef = useRef(null);
  const treeGraphRef = useRef(null);
  const currentDragPositionRef = useRef(new Position());
  const currentDropPositionRef = useRef(new Position());

  useEffect(() => {
    if (!treeGraphRef.current) {
      treeGraphRef.current = new TreeGraph({
        container: containerRef.current,
        width,
        height,
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
          edit: ['click-select'],
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
              fill: '#409eff',
              fontSize: 14,
            },
          },
          style: {
            fill: '#ecf5ff',
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
      treeGraph.data(data);
      treeGraph.render();
      treeGraph.moveTo(initialX, initialY);
      treeGraph.on('drag', (e) => {
        const dragItem = e.item;
        const dragBox = dragItem._cfg.bboxCache;
        if (dragBox) {
          currentDragPositionRef.current = new Position(
            [dragBox.centerX, dragBox.centerY],
            [dragBox.width, dragBox.height],
          );
        }
      });
      treeGraph.on('node:dragover', (e) => {
        // const dragTarget = e.items[0];
        // const dropTarget = e.targetItem;
        const dropItem = e.item;
        const dropBox = dropItem._cfg.bboxCache;
        if (dropBox) {
          currentDropPositionRef.current = new Position(
            [dropBox.centerX, dropBox.centerY],
            [dropBox.width, dropBox.height],
          );
        }
      });
      treeGraph.on('dragend', () => {
        console.log(currentDragPositionRef.current, currentDropPositionRef.current);
      });
    } else {
      // 当vdom改变时仅更新treeGraph
      const treeGraph = treeGraphRef.current;
      treeGraph.changeDate(data);
    }
  }, [data]);

  return <div ref={containerRef} style={style ? style : undefined}></div>;
};

export default Tree;
