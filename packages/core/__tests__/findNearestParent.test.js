import { findNearestParent } from '../src/shared/hooks/useRenderEditableWrapper';
import testJson from '../src/testJson';

const testTree = JSON.parse(testJson).vdom;

test('test findNearestParent [2, 1]', () => {
  const result = findNearestParent(testTree, [2, 1]);
  expect(result).toBe(testTree[2]);
});

test('test findNearestParent [3, 0]', () => {
  const result = findNearestParent(testTree, [3, 0]);
  expect(result).toBe(testTree[3]);
});

test('test findNearestParent [2, 1, 0]', () => {
  const result = findNearestParent(testTree, [2, 1, 0]);
  expect(result).toBe(testTree[2].children[1]);
});

test('test findNearestParent [3, 0, 0]', () => {
  const result = findNearestParent(testTree, [3, 0, 0]);
  expect(result).toBe(testTree[3].columns[4].render[0]);
});

test('test findNearestParent [0, 1, 2]', () => {
  const result = findNearestParent(testTree, [0, 1, 2]);
  expect(result).toBe(null);
});

test('test findNearestParent [0, 1, 2]', () => {
  const result = findNearestParent(testTree, [0, 1, 2]);
  expect(result).toBe(null);
});

test('test findNearestParent modal [4, "footer", 1]', () => {
  const result = findNearestParent(testTree, [4, 'footer', 1]);
  expect(result).toBe(testTree[4].footer);
});

test('test findNearestParent child in modal footer [4, "footer", 1, 0]', () => {
  const result = findNearestParent(testTree, [4, 'footer', 1, 0]);
  expect(result).toBe(testTree[4].footer[1]);
});

test('test findNearestParent []', () => {
  const result = findNearestParent(testTree, []);
  expect(result).toBe(null);
});

test('test findNearestParent undefined', () => {
  const result = findNearestParent(undefined, undefined);
  expect(result).toBe(null);
});
