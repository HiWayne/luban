import type { NodeAST as NodeASTOfFrontstage } from '../frontstage';
import type { NodeAST as NodeASTOfBackstage } from '../backstage';

export interface TemplateRequestDTO {
  id?: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage | NodeASTOfBackstage;
  author_name: string;
  author_id?: number;
  status: 'active' | 'inactive';
}

export interface TemplateResponseDTO {
  id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage | NodeASTOfBackstage;
  author_name: string;
  author_id?: number;
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
}

export interface TemplateEntity {
  _id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage | NodeASTOfBackstage;
  author_name: string;
  author_id?: number;
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
  status: 'active' | 'inactive' | 'delete';
}
