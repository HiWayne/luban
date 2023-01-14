import type { NodeAST as NodeASTOfFrontstage } from '@/backend/types/frontstage';
import type { NodeAST as NodeASTOfBackstage } from '@/backend/types/backstage';

export interface SaveTemplateRequestDTO {
  id?: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc?: string;
  view: NodeASTOfFrontstage | NodeASTOfBackstage;
  author_id?: number;
  status: 'active' | 'inactive';
  tags?: string[];
  collaborators?: number[];
}

export interface UpdateTemplateRequestDTO {
  id: string;
  private: boolean;
  name: string;
  desc?: string;
  view?: NodeASTOfFrontstage | NodeASTOfBackstage;
  status: 'active' | 'inactive';
  tags?: string[];
  collaborators?: number[];
}

export interface GetTemplatesRequestDTO {
  id?: string;
  type?: 'toc' | 'tob';
  name?: string;
  desc?: string;
  author_name?: string;
  author_id?: number;
  tags?: string;
  collaborators?: string;
  start?: number;
  limit?: number;
}

export interface GetOwnRequestDTO {
  type?: 'toc' | 'tob';
  name?: string;
  desc?: string;
  tags?: string;
  collaborators?: string;
  status?: 'active' | 'inactive';
  start?: number;
  limit?: number;
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
  tags: string[];
}

export interface TemplateEntity {
  _id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage | NodeASTOfBackstage;
  author_name?: string;
  author_id?: number | null;
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
  status: 'active' | 'inactive' | 'delete';
  tags: string[];
  collaborators: number[];
}