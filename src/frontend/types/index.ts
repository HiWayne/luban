import { NodeAST as NodeASTOfFrontstage } from '@/backend/types/frontstage';
import { NodeAST as NodeASTOfBackstage } from '@/backend/types/backstage';

export type NodeAST = (NodeASTOfFrontstage | NodeASTOfBackstage) & {
  // 是否是收敛汇聚的。设置为true时，该组件以及子组件始终整体移动。
  convergent?: boolean;
};

export interface EditorQuery {
  type: 'page' | 'template';
  ui: 'toc' | 'tob';
  id: string;
}
