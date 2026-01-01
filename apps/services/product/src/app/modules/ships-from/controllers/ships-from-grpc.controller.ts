import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateShipsFromRequest,
  DeleteShipsFromRequest,
  UpdateShipsFromRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ShipsFromService } from '../services/ships-from.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ShipsFromGrpcController {
  constructor(private readonly shipsFromService: ShipsFromService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'CreateShipsFrom')
  createShipsFrom(data: CreateShipsFromRequest) {
    return this.shipsFromService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'UpdateShipsFrom')
  updateShipsFrom(data: UpdateShipsFromRequest) {
    return this.shipsFromService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'DeleteShipsFrom')
  deleteShipsFrom(data: DeleteShipsFromRequest) {
    return this.shipsFromService.delete(data);
  }
}
