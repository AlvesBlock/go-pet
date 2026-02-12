import type { Driver, DriverApplicationStatus } from '../../domain/types';
import type { CreateDriverDto } from '../dto/create-driver.dto';

export abstract class DriverRepository {
  abstract create(data: CreateDriverDto): Promise<Driver>;
  abstract findAll(): Promise<Driver[]>;
  abstract findById(id: string): Promise<Driver | null>;
  abstract updateStatus(id: string, status: DriverApplicationStatus, notes?: string): Promise<Driver>;
}
