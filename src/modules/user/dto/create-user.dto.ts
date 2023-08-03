import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from '@prisma/client';

export class CreateUserDto implements Omit<User, 'id'> {
  @IsEmail({}, { message: '请输入合法的邮箱' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: '请输入姓名',
  })
  name: string;

  @MinLength(8)
  @MaxLength(12)
  password: string;
}
