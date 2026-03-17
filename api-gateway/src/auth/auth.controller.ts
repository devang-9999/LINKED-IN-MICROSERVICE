import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/jwt/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: any, @Res() res: express.Response) {
    const response = await this.authService.register(body);

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('set-cookie', cookies);
    }

    return res.status(response.status).json(response.data);
  }
  @Public()
  @Post('login')
  async login(@Body() body: any, @Res() res: express.Response) {
    const response = await this.authService.login(body);

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('set-cookie', cookies);
    }

    return res.status(response.status).json(response.data);
  }

  @Post('logout')
  async logout(@Res() res: express.Response) {
    const response = await this.authService.logout();

    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('set-cookie', cookies);
    }

    return res.status(response.status).json(response.data);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: express.Response) {
    const response = await this.authService.getById(id);
    return res.status(response.status).json(response.data);
  }

  @Delete(':id')
  async removeById(@Param('id') id: string, @Res() res: express.Response) {
    const response = await this.authService.deleteById(id);
    return res.status(response.status).json(response.data);
  }
}
