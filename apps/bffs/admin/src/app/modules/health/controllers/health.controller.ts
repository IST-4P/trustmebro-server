import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.healthService.checkMemoryHeap();
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.healthService.checkReadiness();
  }
}
