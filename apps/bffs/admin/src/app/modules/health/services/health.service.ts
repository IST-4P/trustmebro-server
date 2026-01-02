import { RedisConfiguration } from '@common/configurations/redis.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { HealthLibService } from '@common/health';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor(private healthLibService: HealthLibService) {}

  checkMemoryHeap() {
    return this.healthLibService.checkMemoryHeap();
  }

  checkReadiness() {
    return this.healthLibService.checkReadiness({
      grpcServices: Object.values(GrpcService),
      redis: RedisConfiguration.REDIS_URL,
      prismaClient: null,
    });
  }
}
