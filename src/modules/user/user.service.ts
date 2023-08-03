import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';

import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  findUser(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 20);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  removeUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
