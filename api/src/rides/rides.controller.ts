import { Body, Controller, Param, Post } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import type { ChatMessage, Ride } from '../domain/types';

@Controller('rides')
export class RidesController {
  constructor(private readonly dataStore: DataStoreService) {}

  @Post()
  createRide(@Body() payload: CreateRideDto): Promise<Ride> {
    return this.dataStore.createRide(payload);
  }

  @Post(':id/messages')
  sendMessage(@Param('id') rideId: string, @Body() payload: CreateMessageDto): ChatMessage {
    return this.dataStore.addMessage(rideId, payload);
  }
}
