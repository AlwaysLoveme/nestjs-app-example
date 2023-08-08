import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { Public } from '@/decorators/public.decorator';
import { LoginAuthDto, RegisterAuthDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @ApiCreatedResponse({ type: AuthEntity })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }
}
