import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: '请输入合法的邮箱',
    },
  )
  @ApiProperty({
    default: '18270244870@163.com',
  })
  email: string;

  @MinLength(8, {
    message: '密码长度最少8位字符',
  })
  @MaxLength(12, {
    message: '密码长度最大为 12 字符',
  })
  @ApiProperty({
    default: 'a12345678',
  })
  password: string;
}

export class RegisterAuthDto implements Omit<User, 'id'> {
  @IsEmail({}, { message: '请输入合法的邮箱' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: '请输入姓名',
  })
  name: string;

  @MinLength(8, {
    message: '密码不少于 8 位',
  })
  @MaxLength(12, {
    message: '密码不超过 12 位',
  })
  password: string;
}
