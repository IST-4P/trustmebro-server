import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetAttributeRequest,
  GetManyAttributesRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AttributeService } from '../services/attribute.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AttributeGrpcController {
  constructor(private readonly attributeService: AttributeService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyAttributes')
  getManyAttributes(data: GetManyAttributesRequest) {
    return this.attributeService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetAttribute')
  getAttribute(data: GetAttributeRequest) {
    return this.attributeService.findById(data);
  }
}
