import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Roles } from './decorators/roles/roles.decorator';
import { RolesGuard } from './guards/roles/roles.guard';
import { CurrentUser } from './decorators/current-user/current-user.decorator';
import { Throttle } from '@nestjs/throttler';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
@Throttle({
  default: {
    limit: 5,
    ttl: 60000,
  },
})
@HttpCode(HttpStatus.OK)
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(
      refreshTokenDto.refreshToken,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(
      refreshTokenDto.refreshToken,
    );
  }

  @Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: unknown) {
  return {
    message: 'Profile retrieved successfully.',
    user,
  };
}
  @Get('admin-area')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getAdminArea(@CurrentUser() user: unknown) {
  return {
    message: 'Admin area accessed successfully.',
    user,
  };
}

@Get('staff-area')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
getStaffArea(@CurrentUser() user: unknown) {
  return {
    message: 'Staff area accessed successfully.',
    user,
  };
}
}