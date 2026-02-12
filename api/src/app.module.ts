import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardController } from './dashboard/dashboard.controller';
import { RidesController } from './rides/rides.controller';
import { IncidentsController } from './incidents/incidents.controller';
import { DataStoreService } from './data/data-store.service';
import { DriversModule } from './drivers/drivers.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    UploadsModule,
    DriversModule,
  ],
  controllers: [DashboardController, RidesController, IncidentsController],
  providers: [DataStoreService],
})
export class AppModule {}
