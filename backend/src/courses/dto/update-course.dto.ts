import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Semester } from '../../generated/prisma/client';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  localCredit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(60)
  ects?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  year?: number;

  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  departmentId?: string;
}