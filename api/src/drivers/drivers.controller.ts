import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  list() {
    return this.driversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateDriverDto) {
    return this.driversService.create(payload);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() payload: UpdateDriverStatusDto) {
    return this.driversService.updateStatus(id, payload);
  }
}
