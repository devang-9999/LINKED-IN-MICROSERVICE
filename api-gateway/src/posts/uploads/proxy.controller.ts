/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// upload-proxy.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { createProxyServer } from 'http-proxy';
import express from 'express';

const proxy = createProxyServer({});

@Controller()
export class UploadProxyController {
  @Get('uploads/*')
  proxyUploads(@Req() req: express.Request, @Res() res: express.Response) {
    req.url = req.originalUrl.replace('/uploads', '/uploads');

    proxy.web(req, res, {
      target: process.env.POSTS_SERVICE_URL,
      changeOrigin: true,
    });
  }
}
