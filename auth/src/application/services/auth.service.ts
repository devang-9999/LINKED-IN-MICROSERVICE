/* eslint-disable @typescript-eslint/await-thenable */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from '../../domain/entities/auth.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { BcryptUtil } from 'src/shared/utils/bcrypt';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,

    @InjectRepository(OutboxEvent)
    private outboxRepository: Repository<OutboxEvent>,

    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email;
    const password = registerDto.password;

    const existingUser = await this.authRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await BcryptUtil.hashPassword(password);

    const userId = randomUUID();

    const newAuth = this.authRepository.create({
      email,
      password: hashedPassword,
      userId,
    });

    await this.authRepository.save(newAuth);

    const event = this.outboxRepository.create({
      aggregateType: 'auth',
      aggregateId: userId,
      eventType: 'auth.user.registered',
      payload: {
        userId,
        email,
      },
      processed: false,
    });

    await this.outboxRepository.save(event);

    const token = this.jwtService.sign({
      sub: userId,
      email,
    });

    return {
      accessToken: token,
      userId,
    };
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email;
    const password = loginDto.password;

    const authUser = await this.authRepository.findOne({
      where: { email },
    });

    if (!authUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await BcryptUtil.comparePassword(
      password,
      authUser.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: authUser.userId,
      email: authUser.email,
    });

    const event = this.outboxRepository.create({
      aggregateType: 'auth',
      aggregateId: authUser.userId,
      eventType: 'auth.user.logged_in',
      payload: {
        userId: authUser.userId,
        email: authUser.email,
      },
      processed: false,
    });

    await this.outboxRepository.save(event);

    return {
      accessToken: token,
      userId: authUser.userId,
    };
  }

  async getById(id: string) {
    const auth = await this.authRepository.findOne({
      where: { id },
    });

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    return auth;
  }

  async removeById(id: string) {
    const auth = await this.authRepository.findOne({
      where: { id },
    });

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    await this.authRepository.remove(auth);

    return {
      message: 'Auth removed',
    };
  }
}
