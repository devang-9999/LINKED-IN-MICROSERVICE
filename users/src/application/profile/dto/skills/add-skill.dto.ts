/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength } from 'class-validator';

export class AddSkillDto {
  @IsString()
  @MinLength(2)
  name: string;
}
