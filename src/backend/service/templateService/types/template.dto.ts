import type { NodeAST as NodeASTOfFrontstage } from '@/backend/types/frontstage';
import type { NodeAST as NodeASTOfBackstage } from '@/backend/types/backstage';

export interface SaveTemplateRequestDTO {
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc?: string;
  view: NodeASTOfFrontstage[] | NodeASTOfBackstage[];
  config: Record<number, any>;
  author_id?: number;
  status: 'active' | 'inactive';
  tags?: string[];
  collaborators?: number[];
  preview?: string;
}

export interface UpdateTemplateRequestDTO {
  id: string;
  private: boolean;
  name: string;
  desc?: string;
  view?: NodeASTOfFrontstage[] | NodeASTOfBackstage[];
  config?: Record<number, any>;
  status: 'active' | 'inactive';
  tags?: string[];
  collaborators?: number[];
  preview?: string;
}

export interface GetTemplatesRequestDTO {
  id?: string;
  type?: 'toc' | 'tob';
  name?: string;
  desc?: string;
  author_name?: string;
  author_id?: string;
  tags?: string;
  collaborators?: string;
  start?: string;
  limit?: string;
}

export interface FormatGetTemplatesRequestDTO {
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
  start?: string;
  limit?: string;
}

export interface FormatGetOwnRequestDTO {
  type?: 'toc' | 'tob';
  name?: string;
  desc?: string;
  tags?: string;
  collaborators?: string;
  status?: 'active' | 'inactive';
  start?: number;
  limit?: number;
}

export interface TemplateBriefResponseDTO {
  id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  author: {
    author_name: string;
    author_id: number | null;
    author_avatar: string;
  };
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
  tags: string[];
  preview?: string;
}

export interface TemplateDetailResponseDTO {
  id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage[] | NodeASTOfBackstage[];
  config: Record<number, any>;
  author: {
    author_name: string;
    author_id: number | null;
    author_avatar: string;
  };
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
  tags: string[];
  preview?: string;
}

export interface TemplateEntity {
  _id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: NodeASTOfFrontstage[] | NodeASTOfBackstage[];
  config: Record<number, any>;
  author: {
    author_name: string;
    author_id: number | null;
    author_avatar: string;
  };
  collect_count: number;
  like_count: number;
  use_count: number;
  create_time: number;
  update_time: number;
  status: 'active' | 'inactive' | 'delete';
  tags: string[];
  collaborators: number[];
  preview: string | null;
}
