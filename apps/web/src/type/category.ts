export interface ICategory {
  id: number;
  name: string;
}
export interface ICategoryCreate {
  name: string;
}

export interface ICategoryDel {
  id: number;
  onDeleted: () => Promise<void>;
}
