import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateShopRequestDto,
  GetShopRequestDto,
  UpdateShopRequestDto,
} from '@common/interfaces/dtos/user-access';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ShopService } from '../services/shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopReadService: ShopService) {}

  @Get(':id')
  @IsPublic()
  async getShop(
    @Param() params: GetShopRequestDto,
    @ProcessId() processId: string
  ) {
    return this.shopReadService.getShop({ ...params, processId });
  }

  @Post()
  async createShop(
    @Body() body: Omit<CreateShopRequestDto, 'ownerId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.shopReadService.createShop({
      ...body,
      processId,
      ownerId: userId,
    });
  }

  @Put()
  async updateShop(
    @Body() body: Omit<UpdateShopRequestDto, 'ownerId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.shopReadService.updateShop({
      ...body,
      processId,
      ownerId: userId,
    });
  }
}
