import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { DepartmentType } from '../../generated/prisma/client';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(DepartmentType)
  type?: DepartmentType;

  @IsOptional()
  @IsString()
  description?: string;
}