import 'antd/dist/antd.css';
import Page from 'render/index';
import testJson from './basicTest';

const App = () => {
  return <Page data={testJson} />;
};

export default App;
