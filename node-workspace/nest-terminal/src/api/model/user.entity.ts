import { BaseEntity } from "./base.entity";

export interface User extends BaseEntity {
  name: string;
  displayName: string;
  builtin: boolean;
}
