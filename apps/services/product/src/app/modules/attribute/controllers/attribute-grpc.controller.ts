import {
  CreateAttributeRequest,
  GetAttributeRequest,
  GetAttributeResponse,
  GetManyAttributesRequest,
  GetManyAttributesResponse,
} from '@common/interfaces/models/product';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AttributeService } from '../services/attribute.service';

@Controller('attribute')
// @UseInterceptors(GrpcLoggingInterceptor)
export class AttributeGrpcController {
  constructor(private readonly attributeService: AttributeService) {}

  // @GrpcMethod('ProductService', 'GetManyAttributes')
  // getManyAttributes(
  //   data: GetManyAttributesRequest
  // ): Promise<GetManyAttributesResponse> {
  //   return this.attributeService.list(data);
  // }

  // @GrpcMethod('ProductService', 'GetAttribute')
  // getAttribute(
  //   data: GetAttributeRequest
  // ): Promise<GetAttributeResponse | null> {
  //   return this.attributeService.findById(data);
  // }

  // @GrpcMethod('ProductService', 'CreateAttribute')
  // createAttribute(data: CreateAttributeRequest): Promise<GetAttributeResponse> {
  //   return this.attributeService.create(data);
  // }

  @Get()
  getManyAttributes(
    @Query() queries: GetManyAttributesRequest
  ): Promise<GetManyAttributesResponse> {
    return this.attributeService.list(queries);
  }

  @Get(':id')
  getAttribute(
    @Param() params: GetAttributeRequest
  ): Promise<GetAttributeResponse | null> {
    return this.attributeService.findById(params);
  }

  @Post()
  createAttribute(
    @Body() data: CreateAttributeRequest
  ): Promise<GetAttributeResponse> {
    return this.attributeService.create(data);
  }

  // @GrpcMethod('ProductService', 'UpdateAttribute')
  // updateAttribute(data: UpdateAttributeRequest): Promise<GetAttributeResponse> {
  //   return this.attributeService.update(data);
  // }

  // @GrpcMethod('ProductService', 'DeleteAttribute')
  // deleteAttribute(data: DeleteAttributeRequest): Promise<GetAttributeResponse> {
  //   return this.attributeService.delete(data);
  // }
}
