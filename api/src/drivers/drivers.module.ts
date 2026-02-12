import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { DriverRepository } from './repositories/driver.repository';
import { InMemoryDriverRepository } from './repositories/in-memory-driver.repository';
import { PrismaDriverRepository } from './repositories/prisma-driver.repository';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DriversController],
  providers: [
    DriversService,
    {
      provide: DriverRepository,
      useFactory: (config: ConfigService, prisma: PrismaService) => {
        const storage = config.get<string>('DRIVER_STORAGE', 'memory');
        if (storage === 'postgres') {
          return new PrismaDriverRepository(prisma);
        }
        return new InMemoryDriverRepository();
      },
      inject: [ConfigService, PrismaService],
    },
  ],
  exports: [DriversService, DriverRepository],
})
export class DriversModule {}
