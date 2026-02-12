import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private shouldConnect = process.env.DRIVER_STORAGE === 'postgres';

  async onModuleInit() {
    if (this.shouldConnect) {
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (this.shouldConnect) {
      await this.$disconnect();
    }
  }
}
