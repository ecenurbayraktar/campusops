import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkEmailAvailability(createUserDto.email);

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }

    if (user.isActive) {
      throw new ConflictException('The user is already active.');
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
  }

  // Authentication işlemleri için kullanıcıyı e-posta ile bulur.
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Register işlemi için güvenli şekilde öğrenci hesabı oluşturur.
  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    departmentId?: string;
  }) {
    await this.checkEmailAvailability(data.email);

    return this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: data.passwordHash,
        departmentId: data.departmentId,
      },
    });
  }

  // Hash'lenmiş refresh token değerini kullanıcıya kaydeder.
  async updateRefreshToken(
    userId: string,
    refreshTokenHash: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  // Başarılı giriş zamanını günceller.
  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  // Logout işleminde kayıtlı refresh token hash'ini temizler.
  async clearRefreshToken(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  // Create ve register işlemlerinde ortak e-posta kontrolü.
  private async checkEmailAvailability(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return;
    }

    if (existingUser.isActive) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    throw new ConflictException(
      'An inactive user with this email address already exists. Reactivate the existing account instead.',
    );
  }

  async findByIdForAuth(id: string) {
  return this.prisma.user.findUnique({
    where: {
      id,
    },
  });
}

}