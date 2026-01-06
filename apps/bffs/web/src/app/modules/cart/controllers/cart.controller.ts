import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  AddCartItemRequestDto,
  DeleteCartItemRequestDto,
  GetManyCartItemsRequestDto,
  UpdateCartItemRequestDto,
} from '@common/interfaces/dtos/cart';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Put()
  async updateCartItem(
    @Body() body: Omit<UpdateCartItemRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.updateCartItem({ ...body, processId, userId });
  }

  @Delete(':id')
  async deleteCartItem(
    @Param() params: Omit<DeleteCartItemRequestDto, 'userId' | 'processId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.deleteCartItem({
      ...params,
      processId,
      userId,
    });
  }
}
