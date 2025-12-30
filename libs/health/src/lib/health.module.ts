import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthLibService } from './health.service';

@Global()
@Module({
  imports: [TerminusModule],
  providers: [HealthLibService],
  exports: [HealthLibService],
})
export class HealthLibModule {}
