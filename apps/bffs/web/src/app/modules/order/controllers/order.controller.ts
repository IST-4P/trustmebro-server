import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  GetManyOrdersRequestDto,
  GetManyOrdersResponseDto,
  GetOrderRequestDto,
  GetOrderResponseDto,
} from '@common/interfaces/dtos/order';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, OmitType } from '@nestjs/swagger';
import { OrderReadService } from '../services/order-read.service';
import { OrderWriteService } from '../services/order-write.service';

class GetManyOrdersBodyDto extends OmitType(GetManyOrdersRequestDto, [
  'userId',
  'processId',
  'shopId',
  'paymentId',
]) {}
class GetOrderBodyDto extends OmitType(GetOrderRequestDto, [
  'userId',
  'processId',
]) {}
class CreateOrderBodyDto extends OmitType(CreateOrderRequestDto, [
  'userId',
  'processId',
]) {}

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderWriteService: OrderWriteService,
    private readonly orderReadService: OrderReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyOrdersResponseDto })
  async getManyOrders(
    @Query() queries: GetManyOrdersBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.orderReadService.getManyOrders({
      ...queries,
      processId,
      userId,
    });
  }

  @Get(':orderId')
  @ApiOkResponse({ type: GetOrderResponseDto })
  async getOrder(
    @Param() params: GetOrderBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.orderReadService.getOrder({ ...params, processId, userId });
  }

  @Post()
  @ApiOkResponse({ type: CreateOrderResponseDto })
  async createOrder(
    @Body() body: CreateOrderBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.orderWriteService.createOrder({ ...body, processId, userId });
  }
}
