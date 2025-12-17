import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateAttributeRequest,
  DeleteAttributeRequest,
  UpdateAttributeRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AttributeService } from '../services/attribute.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AttributeGrpcController {
  constructor(private readonly attributeService: AttributeService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'CreateAttribute')
  createAttribute(data: CreateAttributeRequest) {
    return this.attributeService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'UpdateAttribute')
  updateAttribute(data: UpdateAttributeRequest) {
    return this.attributeService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'DeleteAttribute')
  deleteAttribute(data: DeleteAttributeRequest) {
    return this.attributeService.delete(data);
  }
}
