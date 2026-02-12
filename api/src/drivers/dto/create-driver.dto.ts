import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { RideCategory } from '../../domain/types';

class VehicleDto {
  @IsString()
  model: string;

  @IsString()
  @MinLength(5)
  plate: string;

  @IsString()
  year: string;
}

export class CreateDriverDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  cnhNumber: string;

  @IsDateString()
  cnhExpiresAt: string;

  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(['BASIC', 'PLUS', 'SUV', 'VET'], { each: true })
  categories: RideCategory[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  equipments: string[];

  @IsOptional()
  @IsDateString()
  trainingCompletedAt?: string;

  @IsOptional()
  @IsString()
  cnhDocumentUrl?: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;
}
