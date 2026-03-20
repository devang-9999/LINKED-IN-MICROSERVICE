/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createProxyServer } from 'http-proxy';
import { Request, Response } from 'express';

const proxy = createProxyServer({
  changeOrigin: true,
  xfwd: true,
});

export const forwardRequest = (req: Request, res: Response, target: string) => {
  proxy.web(req, res, {
    target,
    changeOrigin: true,
    headers: {
      ...req.headers,
    },
  });
};
