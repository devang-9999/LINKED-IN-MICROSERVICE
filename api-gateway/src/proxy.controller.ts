/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Get, Req, Res } from '@nestjs/common';
import { createProxyServer } from 'http-proxy';
import express from 'express';
import axios from 'axios';

const proxy = createProxyServer({
  changeOrigin: true,
  xfwd: true,
});

@Controller()
export class UploadProxyController {
  @Get('uploads/*path')
  async proxyUploads(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const filePath = req.url;

    try {
      try {
        await axios.head(`${process.env.POSTS_SERVICE_URL}${filePath}`);

        return proxy.web(req, res, {
          target: process.env.POSTS_SERVICE_URL,
        });
      } catch {}

      try {
        await axios.head(`${process.env.USERS_SERVICE_URL}${filePath}`);

        return proxy.web(req, res, {
          target: process.env.USERS_SERVICE_URL,
        });
      } catch {}

      return res.status(404).json({
        message: 'File not found',
      });
    } catch (error) {
      console.error('Upload proxy error:', error);

      return res.status(500).json({
        message: 'Upload proxy failed',
      });
    }
  }
}
