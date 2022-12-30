import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>首页</h1>
    <Link to="editor?type=tob">创建后台页面</Link>
    <br />
    <br />
    <Link to="editor?type=toc">创建前台页面</Link>
  </div>
);

export default Home;
