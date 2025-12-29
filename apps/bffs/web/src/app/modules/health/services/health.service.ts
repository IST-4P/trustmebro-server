import { GrpcConfiguration } from '@common/configurations/grpc.config';
import { RedisConfiguration } from '@common/configurations/redis.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { HTTP_MESSAGE } from '@common/constants/http-message.constant';
import { Injectable } from '@nestjs/common';
import {
  RedisOptions,
  TcpClientOptions,
  Transport,
} from '@nestjs/microservices';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator
  ) {}

  checkMemoryHeap() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }

  checkReadiness() {
    const grpcChecks = Object.values(GrpcService).map(
      (service) => () => this.checkGrpcService(service, service)
    );
    return this.health.check([...grpcChecks, () => this.checkRedisService()]);
  }

  checkStartup() {
    return {
      status: HTTP_MESSAGE.OK,
    };
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
}
