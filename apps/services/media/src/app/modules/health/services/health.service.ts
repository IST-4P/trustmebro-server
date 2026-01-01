import { HealthLibService } from '@common/health';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor(private healthLibService: HealthLibService) {}

  checkMemoryHeap() {
    return this.healthLibService.checkMemoryHeap();
  }
}
