import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtAuthGuard } from './jwt/jwt.gaurd';

@Module({
  imports: [AuthModule, UsersModule, JwtModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
