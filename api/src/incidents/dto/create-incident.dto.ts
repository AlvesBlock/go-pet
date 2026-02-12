import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  rideId: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsEnum(['low', 'medium', 'high'])
  severity: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsEnum(['open', 'triaged', 'resolved'])
  status: 'open' | 'triaged' | 'resolved' = 'open';
}
