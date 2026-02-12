import { randomUUID } from 'crypto';
import type { Driver, DriverApplicationStatus } from '../../domain/types';
import type { CreateDriverDto } from '../dto/create-driver.dto';
import { DriverRepository } from './driver.repository';
import { drivers as seedDrivers } from '../../data/seed';

export class InMemoryDriverRepository extends DriverRepository {
  private drivers: Driver[] = seedDrivers.map((driver) => ({
    ...driver,
    applicationStatus: driver.applicationStatus ?? 'APPROVED',
    applicationHistory: ['Seed data import'],
  }));

  async create(data: CreateDriverDto): Promise<Driver> {
    const timestamp = new Date().toISOString();
    const driver: Driver = {
      id: `drv_${randomUUID().slice(0, 8)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      rating: 5,
      completedRuns: 0,
      equipments: data.equipments,
      status: 'OFFLINE',
      vehicle: {
        model: data.vehicle.model,
        plate: data.vehicle.plate,
        category: data.categories,
      },
      applicationStatus: 'PENDING',
      cnhNumber: data.cnhNumber,
      cnhExpiresAt: new Date(data.cnhExpiresAt).toISOString(),
      cnhDocumentUrl: data.cnhDocumentUrl,
      profilePhotoUrl: data.profilePhotoUrl,
      categories: data.categories,
      trainingCompletedAt: data.trainingCompletedAt ?? null,
      applicationHistory: ['Cadastro recebido'],
      applicationNotes: undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.drivers = [driver, ...this.drivers];
    return driver;
  }

  async findAll(): Promise<Driver[]> {
    return this.drivers;
  }

  async findById(id: string): Promise<Driver | null> {
    return this.drivers.find((driver) => driver.id === id) ?? null;
  }

  async updateStatus(id: string, status: DriverApplicationStatus, notes?: string): Promise<Driver> {
    const driver = await this.findById(id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    const historyEntry = `${status} · ${new Date().toISOString()}`;
    const updated: Driver = {
      ...driver,
      applicationStatus: status,
      applicationNotes: notes ?? driver.applicationNotes,
      applicationHistory: [...(driver.applicationHistory ?? []), historyEntry],
      updatedAt: new Date().toISOString(),
    };

    this.drivers = this.drivers.map((item) => (item.id === id ? updated : item));
    return updated;
  }
}
