import { Inject, Injectable } from '@nestjs/common';
import { DriverRepository } from './repositories/driver.repository';
import type { Driver } from '../domain/types';
import type { CreateDriverDto } from './dto/create-driver.dto';
import type { UpdateDriverStatusDto } from './dto/update-driver-status.dto';

@Injectable()
export class DriversService {
  constructor(@Inject(DriverRepository) private readonly repository: DriverRepository) {}

  create(payload: CreateDriverDto): Promise<Driver> {
    return this.repository.create(payload);
  }

  findAll(): Promise<Driver[]> {
    return this.repository.findAll();
  }

  findOne(id: string): Promise<Driver | null> {
    return this.repository.findById(id);
  }

  updateStatus(id: string, payload: UpdateDriverStatusDto): Promise<Driver> {
    return this.repository.updateStatus(id, payload.status, payload.notes);
  }
}
