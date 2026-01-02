import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  AddCartItemRequestDto,
  GetManyCartItemsRequestDto,
} from '@common/interfaces/dtos/cart';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CartService } from '../services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getManyCartItems(
    @Query() queries: Omit<GetManyCartItemsRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.getManyCartItems({ ...queries, processId, userId });
  }

  @Post()
  async addCartItem(
    @Body() body: Omit<AddCartItemRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.addCartItem({ ...body, processId, userId });
  }
}
