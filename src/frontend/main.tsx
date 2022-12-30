import React from 'react';
import ReactDOM from 'react-dom/client';
import { start } from 'qiankun';
import App from './App';

// 启动 qiankun
start();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
