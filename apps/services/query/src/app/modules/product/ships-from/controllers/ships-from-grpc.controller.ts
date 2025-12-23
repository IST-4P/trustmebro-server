import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetManyShipsFromRequest,
  GetShipsFromRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ShipsFromService } from '../services/ships-from.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ShipsFromGrpcController {
  constructor(private readonly brandService: ShipsFromService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyShipsFrom')
  getManyShipsFrom(data: GetManyShipsFromRequest) {
    return this.brandService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetShipsFrom')
  getShipsFrom(data: GetShipsFromRequest) {
    return this.brandService.findById(data);
  }
}
