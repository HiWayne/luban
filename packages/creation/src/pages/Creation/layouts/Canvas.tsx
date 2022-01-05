import React, { FunctionComponent } from 'react';

interface CanvasProps {}

const Canvas: FunctionComponent<CanvasProps> = () => {
  return <div style={{ width: '720px', height: 'calc(100vh - 80px)', border: '1px solid #bbb' }}></div>;
};

export default Canvas;
