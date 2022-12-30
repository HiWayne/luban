import { render } from '@testing-library/react';
import { Route, Routes, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import RouterGuard from '../RouterGuard';

test('RouterGuard 测试 登录无权限', () => {
  const history = createMemoryHistory();
  const { asFragment } = render(
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route path="/login" element={<div>login</div>} />
        <Route
          path="/"
          element={
            <RouterGuard
              from="/"
              element={() => <div />}
              permissions={['normal_manager']}
              __test__={{
                error: false,
                data: {
                  status: 1,
                  data: {
                    identity: [],
                  },
                },
              }}
            />
          }
        />
      </Routes>
    </Router>,
  );
  expect(asFragment()).toMatchSnapshot();
});

test('RouterGuard 测试 未登录', () => {
  const history = createMemoryHistory();
  const { asFragment } = render(
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route path="/login" element={<div>login</div>} />
        <Route
          path="/"
          element={
            <RouterGuard
              from="/"
              element={() => <div />}
              permissions={['normal_manager']}
              __test__={{
                error: false,
                data: {
                  status: 2,
                  data: null,
                },
              }}
            />
          }
        />
      </Routes>
    </Router>,
  );
  expect(asFragment()).toMatchSnapshot();
});

test('RouterGuard 测试 有权限', () => {
  const history = createMemoryHistory();
  const { asFragment } = render(
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route path="/login" element={<div>login</div>} />
        <Route
          path="/"
          element={
            <RouterGuard
              from="/"
              element={() => <div />}
              permissions={['normal_manager']}
              __test__={{
                error: false,
                data: {
                  status: 1,
                  data: { identity: ['normal_manager'] },
                },
              }}
            />
          }
        />
      </Routes>
    </Router>,
  );
  expect(asFragment()).toMatchSnapshot();
});
