import { getArrayFromNode } from '../src/shared/hooks/useRenderEditableWrapper';
import testJson from '../src/testJson';

const testVdom = JSON.parse(testJson).vdom;

test('test getArrayFromNode with form', () => {
  expect(getArrayFromNode(testVdom[2])).toBe(testVdom[2].children);
});

test('test getArrayFromNode with table', () => {
  expect(getArrayFromNode(testVdom[3])).toBe(testVdom[3].columns[4].render);
});

test('test getArrayFromNode with modal content', () => {
  expect(getArrayFromNode(testVdom[4], 'content')).toBe(testVdom[4].content);
});

test('test getArrayFromNode with modal footer', () => {
  expect(getArrayFromNode(testVdom[4], 'footer')).toBe(testVdom[4].footer);
});

test('test getArrayFromNode with undefined', () => {
  expect(getArrayFromNode(testVdom[99])).toBe(null);
  expect(getArrayFromNode({ type: 'test' })).toBe(null);
});
