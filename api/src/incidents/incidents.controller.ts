import { Body, Controller, Post } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import type { Incident } from '../domain/types';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly dataStore: DataStoreService) {}

  @Post()
  createIncident(@Body() payload: CreateIncidentDto): Incident {
    return this.dataStore.createIncident(payload);
  }
}
