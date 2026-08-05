import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { UsersService } from '../../../users/users.service';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const accessSecret = configService.get<string>(
      'JWT_ACCESS_SECRET',
    );

    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.usersService.findByIdForAuth(
      payload.sub,
    );

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Authentication failed.',
      );
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      departmentId: user.departmentId,
    };
  }
}