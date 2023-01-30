import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, HeaderBar } from '@/frontend/components';
import { HEADER_BAR_HEIGHT } from '@/frontend/style';

const Entries = styled(({ className, children }) => (
  <Flex className={className} justifyContent="center">
    {children}
  </Flex>
))`
  padding-top: 200px;
  height: calc(100vh - ${HEADER_BAR_HEIGHT});
  gap: 20px;
`;

const Entry = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 60px;
  background: #fff;
  border-radius: 12px;
  color: #000;
`;

const Home = () => {
  return (
    <div>
      <HeaderBar />
      <Entries>
        <Link to="editor?type=tob">
          <Entry>创建后台页面</Entry>
        </Link>
        <Link to="editor?type=toc">
          <Entry>创建前台页面</Entry>
        </Link>
      </Entries>
    </div>
  );
};

export default Home;
