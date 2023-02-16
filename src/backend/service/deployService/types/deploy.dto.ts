import { PageModel } from '@/backend/types';
import { BriefApplication, DeployStatus } from './deploy.entity';

export interface DeployRequestDTO {
  category: string;
  category_name: string;
  pageModel: PageModel;
  desc?: string;
}

export interface ComputedDeployRequestDTO {
  category: string;
  category_name: string;
  pageModel: PageModel;
  htmlContent: string;
  jsContent: string;
  desc: string;
}

export interface DeployChangeVersionRequestDTO {
  category: string;
  path: string;
  version: number;
}

export interface DeployRecordRequestDTO {
  start: number;
  limit: number;
  category?: string;
  path?: string;
  desc?: string;
  update_time_start?: number;
  update_time_end?: number;
}

export interface DeployRecordResponseDTO {
  id: string;
  category: string;
  category_name: string;
  path: string;
  version: number;
  update_time: number;
  operator: {
    id: number;
    name: string;
    avatar: string;
  };
  versions_total: number;
  status: DeployStatus;
}

export interface DeployDetailDTO {
  id: string;
  category: string;
  category_name: string;
  path: string;
  applications: BriefApplication[];
  version: number;
  update_time: number;
  operator: {
    id: number;
    name: string;
    avatar: string;
  };
  status: DeployStatus;
}

export interface DeleteDeployDTO {
  id: string;
  version: number;
}

export interface DeployCheckDTO {
  category: string;
  path: string;
}
