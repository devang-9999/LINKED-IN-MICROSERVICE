import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import express from 'express';

import { AuthService } from 'src/application/services/auth.service';
import { RegisterDto } from 'src/application/dto/register.dto';
import { LoginDto } from 'src/application/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const result = await this.authService.register(registerDto);

    res.cookie('token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Register successful',
      userId: result.userId,
    });
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      userId: result.userId,
    });
  }

  @Post('logout')
  logout(@Res() res: express.Response) {
    res.clearCookie('token');

    return res.json({
      message: 'Logged out successfully',
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.authService.getById(id);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.authService.removeById(id);
  }
}
