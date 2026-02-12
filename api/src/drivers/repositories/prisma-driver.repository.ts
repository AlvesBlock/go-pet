import type { Driver, DriverApplicationStatus } from '../../domain/types';
import type { CreateDriverDto } from '../dto/create-driver.dto';
import { DriverRepository } from './driver.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Driver as PrismaDriver } from '@prisma/client';

function mapDriver(record: PrismaDriver): Driver {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone ?? undefined,
    rating: 5,
    completedRuns: 0,
    equipments: record.equipments,
    status: 'OFFLINE',
    vehicle: {
      model: record.vehicleModel,
      plate: record.vehiclePlate,
      category: record.categories as Driver['vehicle']['category'],
    },
    applicationStatus: record.status as DriverApplicationStatus,
    cnhNumber: record.cnhNumber,
    cnhExpiresAt: record.cnhExpiresAt.toISOString(),
    cnhDocumentUrl: record.cnhDocumentUrl ?? undefined,
    profilePhotoUrl: record.profilePhotoUrl ?? undefined,
    categories: record.categories as Driver['vehicle']['category'],
    trainingCompletedAt: record.trainingCompletedAt?.toISOString() ?? null,
    applicationNotes: record.applicationNotes ?? undefined,
    applicationHistory: record.applicationHistory ?? [],
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class PrismaDriverRepository extends DriverRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateDriverDto): Promise<Driver> {
    const record = await this.prisma.driver.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cnhNumber: data.cnhNumber,
        cnhExpiresAt: new Date(data.cnhExpiresAt),
        vehicleModel: data.vehicle.model,
        vehiclePlate: data.vehicle.plate,
        vehicleYear: Number(data.vehicle.year),
        categories: data.categories,
        equipments: data.equipments,
        trainingCompletedAt: data.trainingCompletedAt ? new Date(data.trainingCompletedAt) : null,
        cnhDocumentUrl: data.cnhDocumentUrl,
        profilePhotoUrl: data.profilePhotoUrl,
      },
    });
    return mapDriver(record);
  }

  async findAll(): Promise<Driver[]> {
    const records = await this.prisma.driver.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map(mapDriver);
  }

  async findById(id: string): Promise<Driver | null> {
    const record = await this.prisma.driver.findUnique({ where: { id } });
    return record ? mapDriver(record) : null;
  }

  async updateStatus(id: string, status: DriverApplicationStatus, notes?: string): Promise<Driver> {
    const historyEntry = `${status} · ${new Date().toISOString()}${notes ? ` · ${notes}` : ''}`;
    const driver = await this.prisma.driver.update({
      where: { id },
      data: {
        status,
        applicationNotes: notes,
        applicationHistory: {
          push: historyEntry,
        },
      },
    });
    return mapDriver(driver);
  }
}
