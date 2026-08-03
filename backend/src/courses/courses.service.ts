import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const department =
      await this.prisma.department.findUnique({
        where: {
          id: createCourseDto.departmentId,
        },
      });

    if (!department) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    if (!department.isActive) {
      throw new ConflictException(
        'Cannot create a course for an inactive department.',
      );
    }

    const existingCourse =
      await this.prisma.course.findUnique({
        where: {
          code: createCourseDto.code,
        },
      });

    if (existingCourse) {
      if (existingCourse.isActive) {
        throw new ConflictException(
          'Course code is already in use.',
        );
      }

      return this.prisma.course.update({
        where: {
          id: existingCourse.id,
        },
        data: {
          ...createCourseDto,
          isActive: true,
        },
        include: {
          department: true,
        },
      });
    }

    return this.prisma.course.create({
      data: createCourseDto,
      include: {
        department: true,
      },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const course =
      await this.prisma.course.findUnique({
        where: {
          id,
        },
        include: {
          department: true,
        },
      });

    if (!course) {
      throw new NotFoundException(
        'Course not found.',
      );
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ) {
    await this.findOne(id);

    if (updateCourseDto.departmentId) {
      const department =
        await this.prisma.department.findUnique({
          where: {
            id: updateCourseDto.departmentId,
          },
        });

      if (!department) {
        throw new NotFoundException(
          'Department not found.',
        );
      }

      if (!department.isActive) {
        throw new ConflictException(
          'Cannot assign a course to an inactive department.',
        );
      }
    }

    if (updateCourseDto.code) {
      const conflictingCourse =
        await this.prisma.course.findFirst({
          where: {
            code: updateCourseDto.code,
            id: {
              not: id,
            },
          },
        });

      if (conflictingCourse) {
        throw new ConflictException(
          'Course code is already in use.',
        );
      }
    }

    return this.prisma.course.update({
      where: {
        id,
      },
      data: updateCourseDto,
      include: {
        department: true,
      },
    });
  }

  async remove(id: string) {
    const course = await this.findOne(id);

    if (!course.isActive) {
      throw new ConflictException(
        'Course is already inactive.',
      );
    }

    return this.prisma.course.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      include: {
        department: true,
      },
    });
  }

  async activate(id: string) {
    const course = await this.findOne(id);

    if (course.isActive) {
      throw new ConflictException(
        'Course is already active.',
      );
    }

    const department =
      await this.prisma.department.findUnique({
        where: {
          id: course.departmentId,
        },
      });

    if (!department) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    if (!department.isActive) {
      throw new ConflictException(
        'Cannot activate a course whose department is inactive.',
      );
    }

    return this.prisma.course.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      include: {
        department: true,
      },
    });
  }
}