import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  CancelOrderRequestDto,
  GetManyOrdersRequestDto,
  GetManyOrdersResponseDto,
  GetOrderRequestDto,
  GetOrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '@common/interfaces/dtos/order';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { OrderReadService } from '../services/order-read.service';
import { OrderWriteService } from '../services/order-write.service';

class GetManyOrdersBodyDto extends OmitType(GetManyOrdersRequestDto, [
  'processId',
]) {}
class GetOrderBodyDto extends OmitType(GetOrderRequestDto, [
  'processId',
  'userId',
  'shopId',
]) {}
class UpdateOrderStatusBodyDto extends OmitType(UpdateOrderStatusRequestDto, [
  'processId',
]) {}
class CancelOrderBodyDto extends OmitType(CancelOrderRequestDto, [
  'userId',
  'processId',
]) {}

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(
    private readonly orderWriteService: OrderWriteService,
    private readonly orderReadService: OrderReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyOrdersResponseDto })
  async getManyOrders(
    @Query() queries: GetManyOrdersBodyDto,
    @ProcessId() processId: string
  ) {
    return this.orderReadService.getManyOrders({
      ...queries,
      processId,
    });
  }

  @Get(':orderId')
  @ApiOkResponse({ type: GetOrderResponseDto })
  async getOrder(
    @Param() params: GetOrderBodyDto,
    @ProcessId() processId: string
  ) {
    return this.orderReadService.getOrder({ ...params, processId });
  }

  @Put()
  async updateOrderStatus(
    @Body() body: UpdateOrderStatusBodyDto,
    @ProcessId() processId: string
  ) {
    return this.orderWriteService.updateStatusOrder({
      ...body,
      orderId: body.id,
      processId,
    });
  }

  @Delete(':orderId')
  async cancelOrder(
    @Param() params: CancelOrderBodyDto,
    @ProcessId() processId: string
  ) {
    return this.orderWriteService.cancelOrder({
      ...params,
      processId,
    });
  }
}
