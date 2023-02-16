import { PageModel } from '@/backend/types';

export type DeployStatus = 'online' | 'offline' | 'loading';

export interface Application {
  js_name: string;
  js_file: string;
  html_name: 'index';
  html_file: string;
  page_model: PageModel;
  create_time: number;
  version: number;
  desc: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface BriefApplication {
  js_name: string;
  html_name: 'index';
  title: string;
  create_time: number;
  version: number;
  desc: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface DeployEntity {
  _id: string;
  category: string;
  category_name: string;
  path: string;
  applications: Application[];
  count: number;
  version: number;
  update_time: number;
  operator: {
    id: number;
    name: string;
    avatar: string;
  };
  status: DeployStatus;
}
