import { HttpException, NotFoundException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

import { compare, hash, genSaltSync } from 'bcrypt';
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

    const accessToken = await this.jwtService.signAsync({
      uid: user.id,
    });

    return {
      accessToken,
    };
  }

  async register(registerDto: RegisterAuthDto) {
    const exitUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (exitUser) throw new HttpException(`${registerDto.email}已被注册`, 200);

    const salt = genSaltSync();
    const hashPwd = await hash(registerDto.password, salt);
    registerDto.password = hashPwd;

    const user = await this.prisma.user.create({
      data: registerDto,
    });
    const accessToken = await this.jwtService.signAsync({
      uid: user.id,
    });

    return {
      accessToken,
    };
  }
}
