import { _inner_move_layout_to_internal } from '../src/shared/hooks/useRenderEditableWrapper';
import testJson from '../src/testJson';

test('test moveLayoutToInternal 1', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_to_internal(data, [2, 1], [3]);
  expectData[3].columns[4].render.push(expectData[2].children[1]);
  expectData[2].children.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutToInternal 2', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_to_internal(data, [3], [2]);
  expectData[2].children.push(expectData[3]);
  expectData.splice(3, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutToInternal from modal', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_to_internal(data, [4, 'content', 1], [3]);
  expectData[3].columns[4].render.push(expectData[4].content[1]);
  expectData[4].content.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutToInternal to modal 1', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_to_internal(data, [2, 1], [4, 'content']);
  expectData[4].content.push(expectData[2].children[1]);
  expectData[2].children.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});

test('test moveLayoutToInternal to modal 2', () => {
  const data = JSON.parse(testJson).vdom;
  const expectData = JSON.parse(testJson).vdom;
  _inner_move_layout_to_internal(data, [4, 'footer', 1], [4, 'content']);
  expectData[4].content.push(expectData[4].footer[1]);
  expectData[4].footer.splice(1, 1);
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectData));
});
