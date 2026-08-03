import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
  const existingUser = await this.prisma.user.findUnique({
    where: {
      email: createUserDto.email,
    },
  });

  if (existingUser) {
    if (existingUser.isActive) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    throw new ConflictException(
      'An inactive user with this email address already exists. Reactivate the existing account instead.',
    );
  }

  return this.prisma.user.create({
    data: createUserDto,
  });
}

  findAll() {
    return this.prisma.user.findMany({
      where:{
        isActive: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
  
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
    },
  });
}
async activate(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException(`User with id ${id} was not found.`);
  }

  if (user.isActive) {
    throw new ConflictException('The user is already active.');
  }

  return this.prisma.user.update({
    where: { id },
    data: {
      isActive: true,
    },
  });
}


}