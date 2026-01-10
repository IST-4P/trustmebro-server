import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  AddCartItemRequestDto,
  AddCartItemResponseDto,
  DeleteCartItemRequestDto,
  DeleteCartItemResponseDto,
  GetManyCartItemsRequestDto,
  GetManyCartItemsResponseDto,
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
import { ApiOkResponse, OmitType } from '@nestjs/swagger';
import { CartService } from '../services/cart.service';

class GetManyCartItemsBodyDto extends OmitType(GetManyCartItemsRequestDto, [
  'userId',
  'processId',
] as const) {}
class AddCartItemBodyDto extends OmitType(AddCartItemRequestDto, [
  'userId',
  'processId',
] as const) {}
class UpdateCartItemBodyDto extends OmitType(UpdateCartItemRequestDto, [
  'userId',
  'processId',
] as const) {}
class DeleteCartItemBodyDto extends OmitType(DeleteCartItemRequestDto, [
  'userId',
  'processId',
] as const) {}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOkResponse({ type: GetManyCartItemsResponseDto })
  async getManyCartItems(
    @Query() queries: GetManyCartItemsBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.getManyCartItems({ ...queries, processId, userId });
  }

  @Post()
  @ApiOkResponse({ type: AddCartItemResponseDto })
  async addCartItem(
    @Body() body: AddCartItemBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.addCartItem({ ...body, processId, userId });
  }

  @Put()
  @ApiOkResponse({ type: AddCartItemResponseDto })
  async updateCartItem(
    @Body() body: UpdateCartItemBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.cartService.updateCartItem({ ...body, processId, userId });
  }

  @Delete(':cartItemId')
  @ApiOkResponse({ type: DeleteCartItemResponseDto })
  async deleteCartItem(
    @Param() params: DeleteCartItemBodyDto,
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
