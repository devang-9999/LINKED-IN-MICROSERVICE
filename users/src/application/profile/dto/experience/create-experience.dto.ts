/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;
}
