import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
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

  @Get('startup')
  @HealthCheck()
  checkStartup() {
    return this.healthService.checkStartup();
  }
}
