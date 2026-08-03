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

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(30)
  localCredit!: number;

  @IsInt()
  @Min(1)
  @Max(60)
  ects!: number;

  @IsInt()
  @Min(1)
  @Max(6)
  year!: number;

  @IsEnum(Semester)
  semester!: Semester;

  @IsString()
  @IsNotEmpty()
  departmentId!: string;
}