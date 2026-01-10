import { RedisConfiguration } from '@common/configurations/redis.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { HealthLibService } from '@common/health';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private healthLibService: HealthLibService,
    private prismaService: PrismaService
  ) {}

  checkMemoryHeap() {
    return this.healthLibService.checkMemoryHeap();
  }

  checkReadiness() {
    return this.healthLibService.checkReadiness({
      grpcServices: [GrpcService.USER_ACCESS_SERVICE],
      redis: RedisConfiguration.REDIS_URL,
      prismaClient: this.prismaService,
    });
  }
}
