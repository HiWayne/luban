import { NodeAST } from '@/frontend/types';
import { createUniqueId } from './createUniqueId';

export const createRootNodeAST = (): NodeAST => ({
  id: createUniqueId(),
  parent: null,
  type: 'BasicContainer',
  props: {},
  children: [],
});
