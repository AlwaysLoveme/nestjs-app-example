import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

import { compare, genSaltSync, hash } from 'bcrypt';
import { LoginAuthDto, RegisterAuthDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });
    if (!user) {
      throw new NotFoundException(`${loginAuthDto.email} 用户不存在`);
    }

    const isPwdValid = await compare(loginAuthDto.password, user.password);
    if (!isPwdValid) {
      throw new HttpException(`${loginAuthDto.email} 用户密码错误`, 200);
    }

    return await this.jwtService.signAsync({
      uid: user.id,
    });
  }

  async register(registerDto: RegisterAuthDto) {
    const exitUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (exitUser) throw new HttpException(`${registerDto.email}已被注册`, 200);

    const salt = genSaltSync();
    registerDto.password = await hash(registerDto.password, salt);

    const user = await this.prisma.user.create({
      data: registerDto,
    });
    return await this.jwtService.signAsync({
      uid: user.id,
    });
  }
}
