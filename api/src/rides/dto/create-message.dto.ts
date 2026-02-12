import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsEnum(['tutor', 'driver', 'support'])
  senderRole: 'tutor' | 'driver' | 'support';

  @IsString()
  @MinLength(2)
  content: string;
}
