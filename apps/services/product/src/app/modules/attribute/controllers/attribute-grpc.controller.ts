import {
  CreateAttributeRequest,
  DeleteAttributeRequest,
  GetAttributeRequest,
  GetAttributeResponse,
  GetManyAttributesRequest,
  GetManyAttributesResponse,
  UpdateAttributeRequest,
} from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AttributeService } from '../services/attribute.service';

@Controller()
// @UseInterceptors(GrpcLoggingInterceptor)
export class AttributeGrpcController {
  constructor(private readonly attributeService: AttributeService) {}

  @GrpcMethod('ProductService', 'GetManyAttributes')
  getManyAttributes(
    data: GetManyAttributesRequest
  ): Promise<GetManyAttributesResponse> {
    return this.attributeService.list(data);
  }

  @GrpcMethod('ProductService', 'GetAttribute')
  getAttribute(
    data: GetAttributeRequest
  ): Promise<GetAttributeResponse | null> {
    return this.attributeService.findById(data);
  }

  @GrpcMethod('ProductService', 'CreateAttribute')
  createAttribute(data: CreateAttributeRequest): Promise<GetAttributeResponse> {
    return this.attributeService.create(data);
  }

  @GrpcMethod('ProductService', 'UpdateAttribute')
  updateAttribute(data: UpdateAttributeRequest): Promise<GetAttributeResponse> {
    return this.attributeService.update(data);
  }

  @GrpcMethod('ProductService', 'DeleteAttribute')
  deleteAttribute(data: DeleteAttributeRequest): Promise<GetAttributeResponse> {
    return this.attributeService.delete(data);
  }
}
