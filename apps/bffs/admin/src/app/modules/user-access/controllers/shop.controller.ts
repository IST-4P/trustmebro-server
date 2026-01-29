import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyShopsRequestDto,
  GetManyShopsResponseDto,
  GetShopRequestDto,
  GetShopResponseDto,
} from '@common/interfaces/dtos/user-access';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ShopService } from '../services/shop.service';

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOkResponse({ type: GetManyShopsResponseDto })
  async getManyShops(
    @ProcessId() processId: string,
    @Query() queries: GetManyShopsRequestDto
  ) {
    return this.shopService.getManyShops({ ...queries, processId });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetShopResponseDto })
  async getShop(
    @ProcessId() processId: string,
    @Query() queries: GetShopRequestDto
  ) {
    return this.shopService.getShop({ ...queries, processId });
  }
}
