export interface CategoryEntity {
  name: string;
  value: string;
  desc: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  updater: {
    id: number;
    name: string;
    avatar: string;
  } | null;
}
