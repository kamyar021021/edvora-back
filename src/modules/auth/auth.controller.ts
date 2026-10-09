import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, UpdateProfileDto } from './update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.update(user.id, dto);
    return {
      user: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        createdAt: updated.createdAt,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
  ) {
    const fullUser = await this.usersService.findByPhone(user.phone);
    if (!fullUser) {
      throw new UnauthorizedException('کاربر یافت نشد');
    }

    const isValid = await bcrypt.compare(
      dto.currentPassword,
      fullUser.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('رمز فعلی اشتباه است');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(user.id, hashed);

    return { message: 'رمز عبور با موفقیت تغییر کرد' };
  }
}
