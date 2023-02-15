import { TemplateNodeAST } from './template.dto';

export interface TemplateEntity {
  _id: string;
  type: 'toc' | 'tob';
  private: boolean;
  name: string;
  desc: string;
  view: TemplateNodeAST;
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
