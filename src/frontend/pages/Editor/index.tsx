import { getParams } from '@duitang/dt-base';
import styled from 'styled-components';
import ToBEditor from './ToBEditor';
import ToCEditor from './ToCEditor';

const renderMap = {
  toc: ToCEditor,
  tob: ToBEditor,
};

const Editor = () => {
  const { type = 'toc' } = (getParams() || {}) as { type: 'toc' | 'tob' };

  const RenderEditor = renderMap[type];

  return <RenderEditor />;
};

export default Editor;
