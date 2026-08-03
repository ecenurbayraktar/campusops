import { DepartmentType } from '../../generated/prisma/client';

export class UpdateDepartmentDto {
  name?: string;
  code?: string;
  type?: DepartmentType;
  description?: string;
}