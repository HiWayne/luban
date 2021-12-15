import 'antd/dist/antd.css';
import Page from 'render/index';
import testJson from './test';

const App = () => {
  return <Page data={testJson} />;
};

export default App;
