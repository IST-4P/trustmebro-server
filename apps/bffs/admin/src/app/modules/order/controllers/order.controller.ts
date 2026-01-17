import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
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
  'shopId',
  'userId',
  'processId',
]) {}
class GetOrderBodyDto extends OmitType(GetOrderRequestDto, [
  'shopId',
  'userId',
  'processId',
]) {}
class UpdateOrderStatusBodyDto extends OmitType(UpdateOrderStatusRequestDto, [
  'shopId',
  'processId',
]) {}
class CancelOrderBodyDto extends OmitType(CancelOrderRequestDto, [
  'shopId',
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
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.orderReadService.getManyOrders({
      ...queries,
      processId,
      shopId,
    });
  }

  @Get(':orderId')
  @ApiOkResponse({ type: GetOrderResponseDto })
  async getOrder(
    @Param() params: GetOrderBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.orderReadService.getOrder({ ...params, processId, shopId });
  }

  @Put()
  async updateOrderStatus(
    @Body() body: UpdateOrderStatusBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.orderWriteService.updateStatusOrder({
      ...body,
      orderId: body.id,
      processId,
      shopId,
    });
  }

  @Delete(':orderId')
  async cancelOrder(
    @Param() params: CancelOrderBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.orderWriteService.cancelOrder({
      ...params,
      processId,
      shopId,
    });
  }
}
