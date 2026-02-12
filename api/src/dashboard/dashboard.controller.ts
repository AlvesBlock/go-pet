import { Controller, Get } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import type { DashboardSnapshot } from '../domain/types';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dataStore: DataStoreService) {}

  @Get()
  getDashboard(): Promise<DashboardSnapshot> {
    return this.dataStore.getSnapshot();
  }
}
