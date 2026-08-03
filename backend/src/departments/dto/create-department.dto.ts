import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { DepartmentType } from '../../generated/prisma/client';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEnum(DepartmentType)
  type!: DepartmentType;

  @IsOptional()
  @IsString()
  description?: string;
}