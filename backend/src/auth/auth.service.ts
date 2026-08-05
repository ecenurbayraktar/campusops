import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { createHash, randomBytes } from 'crypto';

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.createUser({
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      departmentId: registerDto.departmentId,
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      message: 'User registered successfully.',
      user: this.buildSafeUserResponse(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException(
        'Email or password is incorrect.',
      );
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Email or password is incorrect.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account is inactive.');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await Promise.all([
      this.saveRefreshTokenHash(user.id, tokens.refreshToken),
      this.usersService.updateLastLogin(user.id),
    ]);

    const updatedUser = await this.usersService.findByIdForAuth(
      user.id,
    );

    if (!updatedUser) {
      throw new UnauthorizedException('Authentication failed.');
    }

    return {
      message: 'Login successful.',
      user: this.buildSafeUserResponse(updatedUser),
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    const user = await this.usersService.findByIdForAuth(payload.sub);

    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired.',
      );
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired.',
      );
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      message: 'Tokens refreshed successfully.',
      tokens,
    };
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    const user = await this.usersService.findByIdForAuth(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired.',
      );
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired.',
      );
    }

    await this.usersService.clearRefreshToken(user.id);

    return {
      message: 'Logout successful.',
    };
  }

  async forgotPassword(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const genericResponse = {
    message:
      'If the account exists, a password reset email has been sent.',
  };

  const user = await this.usersService.findByEmail(normalizedEmail);

  if (!user || !user.isActive) {
    return genericResponse;
  }

  const resetToken = randomBytes(32).toString('hex');

  const resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const resetPasswordExpiresAt = new Date(
    Date.now() + 15 * 60 * 1000,
  );

  await this.usersService.savePasswordResetToken(
    user.id,
    resetPasswordToken,
    resetPasswordExpiresAt,
  );

  try {
    await this.mailService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );
  } catch (error) {
    await this.usersService.clearPasswordResetToken(user.id);
    throw error;
  }

  return genericResponse;
}

async resetPassword(
  token: string,
  newPassword: string,
) {
  const resetPasswordToken = createHash('sha256')
    .update(token)
    .digest('hex');

  const user =
    await this.usersService.findByValidPasswordResetToken(
      resetPasswordToken,
      new Date(),
    );

  if (!user) {
    throw new BadRequestException(
      'Password reset token is invalid or expired.',
    );
  }

  const sameAsOldPassword = await bcrypt.compare(
    newPassword,
    user.passwordHash,
  );

  if (sameAsOldPassword) {
    throw new BadRequestException(
      'New password must be different from the current password.',
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await this.usersService.updatePasswordAfterReset(
    user.id,
    passwordHash,
  );

  return {
    message: 'Password reset successfully.',
  };
}

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<TokenPayload> {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
    );

    if (!refreshSecret) {
      throw new InternalServerErrorException(
        'JWT configuration is missing.',
      );
    }

    try {
      return await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired.',
      );
    }
  }

  private async saveRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.usersService.updateRefreshToken(
      userId,
      refreshTokenHash,
    );
  }

  private async generateTokens(payload: TokenPayload) {
    const accessSecret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
    );

    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
    );

    const accessExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );

    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    if (
      !accessSecret ||
      !refreshSecret ||
      !accessExpiresIn ||
      !refreshExpiresIn
    ) {
      throw new InternalServerErrorException(
        'JWT configuration is missing.',
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn:
          accessExpiresIn as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn:
          refreshExpiresIn as JwtSignOptions['expiresIn'],
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private buildSafeUserResponse(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    departmentId: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      departmentId: user.departmentId,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}