/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}
