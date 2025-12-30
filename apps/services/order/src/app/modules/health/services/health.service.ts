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
      grpcServices: [GrpcService.PRODUCT_SERVICE, GrpcService.CART_SERVICE],
      redis: null,
      prismaClient: this.prismaService,
    });
  }
}
