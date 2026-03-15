/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class BcryptUtil {
  static hashPassword(password: string): string {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compare(password, hashedPassword);
  }
}
