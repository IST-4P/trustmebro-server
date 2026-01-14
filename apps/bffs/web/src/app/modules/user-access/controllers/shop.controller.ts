import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateShopRequestDto,
  GetShopRequestDto,
  GetShopResponseDto,
  UpdateShopRequestDto,
} from '@common/interfaces/dtos/user-access';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ShopService } from '../services/shop.service';

class CreateShopBodyDto extends OmitType(CreateShopRequestDto, [
  'ownerId',
  'processId',
] as const) {}

class UpdateShopBodyDto extends OmitType(UpdateShopRequestDto, [
  'ownerId',
  'processId',
] as const) {}

class GetShopBodyDto extends OmitType(GetShopRequestDto, [
  'processId',
  'userId',
] as const) {}

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
  constructor(private readonly shopReadService: ShopService) {}

  @Get()
  @ApiOkResponse({ type: GetShopResponseDto })
  async getMyShop(
    @UserData('userId') userId: string,
    @ProcessId() processId: string
  ) {
    return this.shopReadService.getShop({ userId, processId });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetShopResponseDto })
  @IsPublic()
  async getShop(
    @Param() params: GetShopBodyDto,
    @ProcessId() processId: string
  ) {
    return this.shopReadService.getShop({ ...params, processId });
  }

  @Post()
  @ApiOkResponse({ type: GetShopResponseDto })
  async createShop(
    @Body() body: CreateShopBodyDto,
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
  @ApiOkResponse({ type: GetShopResponseDto })
  async updateShop(
    @Body() body: UpdateShopBodyDto,
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
