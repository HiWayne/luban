import { getParams } from '@duitang/dt-base';
import { EditorQuery } from '../../types';
import ToBEditor from './ToBEditor';
import ToCEditor from './ToCEditor';

const renderMap = {
  toc: ToCEditor,
  tob: ToBEditor,
};

const Editor = () => {
  const { type, ui } = getParams() as any as EditorQuery;

  if (!type || !ui) {
    return <h3>页面缺少参数</h3>;
  }

  const RenderEditor = renderMap[ui];

  return <RenderEditor />;
};

export default Editor;
