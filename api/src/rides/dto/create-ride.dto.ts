import { IsEnum, IsISO8601, IsOptional, IsString, MinLength } from 'class-validator';
import type { RideCategory } from '../../domain/types';

export class CreateRideDto {
  @IsString()
  @MinLength(2)
  tutorName: string;

  @IsString()
  petId: string;

  @IsEnum(['BASIC', 'PLUS', 'SUV', 'VET'], { message: 'Categoria inválida' })
  category: RideCategory;

  @IsString()
  pickupAddress: string;

  @IsString()
  destinationAddress: string;

  @IsISO8601()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
