import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDepartmentDto } from './dto/update-department.dto';
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

  findAll() {
    return this.prisma.department.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

async findOne(id: string) {
  const department =
    await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

  if (!department) {
    throw new NotFoundException(
      'Department not found.',
    );
  }

  return department;
}

async update(
  id: string,
  updateDepartmentDto: UpdateDepartmentDto,
) {
  await this.findOne(id);

  if (
    updateDepartmentDto.name ||
    updateDepartmentDto.code
  ) {
    const conflictingDepartment =
      await this.prisma.department.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [
            ...(updateDepartmentDto.name
              ? [{ name: updateDepartmentDto.name }]
              : []),
            ...(updateDepartmentDto.code
              ? [{ code: updateDepartmentDto.code }]
              : []),
          ],
        },
      });

    if (conflictingDepartment) {
      throw new ConflictException(
        'Department name or code is already in use.',
      );
    }
  }

  return this.prisma.department.update({
    where: {
      id,
    },
    data: updateDepartmentDto,
  });
}
  async remove(id: string) {
  const department = await this.findOne(id);

  if (!department.isActive) {
    throw new ConflictException(
      'Department is already inactive.',
    );
  }

  return this.prisma.department.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}
  async activate(id: string) {
  const department = await this.findOne(id);

  if (department.isActive) {
    throw new ConflictException(
      'Department is already active.',
    );
  }

  return this.prisma.department.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
}
}