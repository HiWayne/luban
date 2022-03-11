import { _inner_move_layout_in_same_level } from '../src/shared/hooks/useRenderEditableWrapper';
import testJson from '../src/testJson';

test('test moveLayoutInSameLevel', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_in_same_level(data, [2, 0], [2, 1]);
  const item0 = expectData[2].children[0];
  const item1 = expectData[2].children[1];
  expectData[2].children[0] = item1;
  expectData[2].children[1] = item0;
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutInSameLevel in modal', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_in_same_level(data, [4, 'footer', 0], [4, 'footer', 1]);
  const item0 = expectData[4].footer[0];
  const item1 = expectData[4].footer[1];
  expectData[4].footer[0] = item1;
  expectData[4].footer[1] = item0;
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});
