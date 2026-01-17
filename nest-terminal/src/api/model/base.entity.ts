export interface BaseEntity {
  id: number;
  createBy: number;
  createAt: string;
  updateAt: string;
  deleteAt?: string;
  deleted: boolean;
  deleteBy?: number;
}
