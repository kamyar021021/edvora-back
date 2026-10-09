import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    createdAt: Date;
    isAdmin: boolean;
  };
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByPhone(dto.phone);
    if (existing) {
      throw new ConflictException('این شماره موبایل قبلاً ثبت شده است');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      phone: dto.phone,
      password: hashedPassword,
    });

    const token = await this.signToken(user.id, user.phone);

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
      },
      token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException(
        'حساب شما تعلیق شده است. با پشتیبانی تماس بگیرید.',
      );
    }

    await this.usersService.recordLogin(user.id);

    const token = await this.signToken(user.id, user.phone);

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
      },
      token,
    };
  }

  private async signToken(userId: string, phone: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId, phone });
  }
}
