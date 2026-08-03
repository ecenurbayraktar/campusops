import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const existingDepartment =
      await this.prisma.department.findFirst({
        where: {
          OR: [
            { name: createDepartmentDto.name },
            { code: createDepartmentDto.code },
          ],
        },
      });

    if (existingDepartment) {
      if (!existingDepartment.isActive) {
        return this.prisma.department.update({
          where: {
            id: existingDepartment.id,
          },
          data: {
            ...createDepartmentDto,
            isActive: true,
          },
        });
      }

      throw new ConflictException(
        'Department name or code is already in use.',
      );
    }

    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }
}