import { HealthLibModule } from '@common/health';
import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';

@Module({
  imports: [HealthLibModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
