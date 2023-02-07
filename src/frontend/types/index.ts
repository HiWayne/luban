import { NodeAST as NodeASTOfFrontstage } from '@/backend/types/frontstage';
import { NodeAST as NodeASTOfBackstage } from '@/backend/types/backstage';

export type NodeAST = (NodeASTOfFrontstage | NodeASTOfBackstage) & {
  isRoot?: boolean;
};

export interface EditorQuery {
  type: 'page' | 'template';
  ui: 'toc' | 'tob';
}
