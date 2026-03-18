/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/jwt/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.authService.register(body, req.headers);

    this.forwardCookies(response, res);

    return res.status(response.status).json(response.data);
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.authService.login(body, req.headers);

    this.forwardCookies(response, res);

    return res.status(response.status).json(response.data);
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: express.Response) {
    const response = await this.authService.logout(req.headers);

    this.forwardCookies(response, res);

    return res.status(response.status).json(response.data);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.authService.getById(id, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Delete(':id')
  async removeById(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.authService.deleteById(id, req.headers);

    return res.status(response.status).json(response.data);
  }

  private forwardCookies(response: any, res: express.Response) {
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('set-cookie', cookies);
    }
  }
}
