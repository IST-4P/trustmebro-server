import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { CreateOrderRequestDto } from '@common/interfaces/dtos/order';
import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly cartService: OrderService) {}

  @Post()
  async createOrder(
    @Body() body: Omit<CreateOrderRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.createOrder({ ...body, processId, userId });
  }
}
