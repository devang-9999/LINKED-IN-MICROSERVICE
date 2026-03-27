/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',

    filename: (
      _req: any,
      file: { originalname: string },
      callback: (error: null, filename: string) => void,
    ) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      callback(null, uniqueName + fileExtension);
    },
  }),

  fileFilter: (req: any, file: any, callback: any) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only image, gif, and video files are allowed'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
};
