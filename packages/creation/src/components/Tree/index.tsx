import { CSSProperties, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { TreeGraph } from '@antv/g6';
import { GraphData, TreeGraphData } from '@antv/g6-core';
import styled from '@emotion/styled';

const EditorWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  font-size: 16px;
  border: 1px solid #eee;
  background: #fff;
`;

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
  const [showEditor, setShowEditor] = useState(false);
  const showEditorRef = useRef(false);
  const [editorX, setEditorX] = useState(0);
  const [editorY, setEditorY] = useState(0);

  const updateEditorPosition = useCallback((e) => {
    if (e) {
      const { item } = e;
      const model = item.getModel();
      const { x, y } = model;
      // 这里有个知识点：在react的legacy模式下，浏览器原生事件或异步操作会脱离对setState的批量更新，所以它将会是同步更新的，多个setState会更新多次
      // 如果在react事件或生命周期里，则会批量更新。或者在concurrent模式或react18的createRoot下。或者手动调用unstable_batchedUpdates
      unstable_batchedUpdates(() => {
        setEditorX(x + initialX * 6 + 40);
        setEditorY(y + initialY * 6 + 25);
        showEditorRef.current = true;
        setShowEditor(true);
      });
    }
  }, []);

  const hiddenEditor = useCallback(() => {
    showEditorRef.current = false;
    setShowEditor(false);
  }, []);

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
      treeGraph.on('node:click', (e) => {
        console.log(e);
        if (!showEditorRef.current) {
          updateEditorPosition(e);
        } else {
          hiddenEditor();
        }
      });
      treeGraph.on('drag', (e) => {
        if (showEditorRef.current) {
          updateEditorPosition(e);
        }
      });
    } else {
      // 当vdom改变时仅更新treeGraph
      const treeGraph = treeGraphRef.current;
      treeGraph.changeDate(data);
    }
  }, [data]);

  return (
    <>
      <div ref={containerRef} style={style ? style : undefined}></div>
      {showEditor ? (
        <EditorWrapper
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ left: editorX + 'px', top: editorY + 'px' }}
        >
          编辑
        </EditorWrapper>
      ) : null}
    </>
  );
};

export default Tree;
