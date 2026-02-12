import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import type { DriverApplicationStatus } from '../../domain/types';

export class UpdateDriverStatusDto {
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE'])
  status: DriverApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}
