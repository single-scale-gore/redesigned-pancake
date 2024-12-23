import { Controller, Get, Query } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly service: AwsService) {}

  @Get('usage')
  getUsage(
    @Query('ipAddress') ipAddress: string,
    @Query('interval') interval: string,
    @Query('timePeriod') timePeriod: string,
  ) {
    return this.service.getCpuUsage(ipAddress, interval, timePeriod);
  }
}
