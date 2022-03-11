import { _inner_move_layout_cross_level, Direction } from '../src/shared/hooks/useRenderEditableWrapper';
import testJson from '../src/testJson';

// 跨层级移动

test('test moveLayoutCrossLevel DOWN 1', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.DOWN, data, [2, 1], [3]);
  expectData.splice(4, 0, expectData[2].children[1]);
  expectData[2].children.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutCrossLevel DOWN 2', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.DOWN, data, [3], [2, 1]);
  expectData[2].children.splice(2, 0, expectData[3]);
  expectData.splice(3, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutCrossLevel UP 1', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.UP, data, [2, 1], [3]);
  expectData.splice(3, 0, expectData[2].children[1]);
  expectData[2].children.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutCrossLevel UP 2', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.UP, data, [3], [2, 1]);
  expectData[2].children.splice(1, 0, expectData[3]);
  expectData.splice(3, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutCrossLevel from modal', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.UP, data, [4, 'footer', 1], [2, 1]);
  expectData[2].children.splice(1, 0, expectData[4].footer[1]);
  expectData[4].footer.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutCrossLevel to modal', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_cross_level(Direction.UP, data, [2, 1], [4, 'footer', 1]);
  expectData[4].footer.splice(1, 0, expectData[2].children[1]);
  expectData[2].children.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});
