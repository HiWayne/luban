export interface CategoryRequestDTO {
  start: number;
  limit: number;
}

export interface CategoryResponseDTO {
  name: string;
  value: string;
  desc: string;
}

export interface CategoryCreateDTO {
  name: string;
  value: string;
  desc?: string;
}

export interface CategoryDeleteDTO {
  value: string;
}
