import { GrpcConfiguration } from '@common/configurations/grpc.config';
import { RedisConfiguration } from '@common/configurations/redis.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Injectable } from '@nestjs/common';
import {
  RedisOptions,
  TcpClientOptions,
  Transport,
} from '@nestjs/microservices';
import {
  HealthCheckService,
  HealthIndicatorFunction,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthLibService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private prismaHealthIndicator: PrismaHealthIndicator
  ) {}

  checkMemoryHeap() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }

  checkReadiness(data: {
    grpcServices: GrpcService[];
    redis: string;
    prismaClient: any;
  }) {
    const targetChecks: HealthIndicatorFunction[] = [];

    // Check grpc services
    if (data.grpcServices && data.grpcServices.length > 0) {
      const grpcChecks = data.grpcServices.map(
        (service) => () => this.checkGrpcService(`${service}_grpc`, service)
      );
      targetChecks.push(...grpcChecks);
    }

    // Check Redis
    if (data.redis) {
      targetChecks.push(() => this.checkRedisService());
    }

    // Check Prisma
    if (data.prismaClient) {
      targetChecks.push(() => this.checkPrisma(data.prismaClient));
    }
    return this.health.check(targetChecks);
  }

  private checkGrpcService(key: string, name: GrpcService) {
    const url = GrpcConfiguration[`${name}_GRPC_URL`];
    return this.microservice.pingCheck<TcpClientOptions>(key, {
      transport: Transport.TCP,
      options: {
        host: url.split(':')[0],
        port: parseInt(url.split(':')[1], 10),
      },
    });
  }

  private checkRedisService() {
    const url = new URL(RedisConfiguration.REDIS_URL);
    return this.microservice.pingCheck<RedisOptions>('redis', {
      transport: Transport.REDIS,
      options: {
        host: url.hostname,
        port: parseInt(url.port, 10),
        password: url.password,
        username: url.username,
      },
    });
  }

  private checkPrisma(prismaClient: any, timeout = 3000) {
    return this.prismaHealthIndicator.pingCheck('database', prismaClient, {
      timeout,
    });
  }
}
