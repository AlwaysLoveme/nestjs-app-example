import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class UserEntity implements Omit<User, 'password'> {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  // @ApiProperty()
  // password: string;
}
