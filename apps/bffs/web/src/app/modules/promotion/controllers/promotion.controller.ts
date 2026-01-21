import { PromotionStatusValues } from '@common/constants/promotion.constant';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  GetManyPromotionsRequestDto,
  GetManyPromotionsResponseDto,
  GetPromotionRequestDto,
  GetPromotionResponseDto,
} from '@common/interfaces/dtos/promotion';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { PromotionService } from '../services/promotion.service';

class GetPromotionBodyDto extends OmitType(GetPromotionRequestDto, [
  'code',
] as const) {}

class GetManyPromotionsBodyDto extends OmitType(GetManyPromotionsRequestDto, [
  'code',
  'name',
  'status',
  'startsAt',
  'endsAt',
  'includeUsed',
  'userId',
] as const) {}

@Controller('promotion')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get()
  @ApiOkResponse({ type: GetManyPromotionsResponseDto })
  async getManyPromotions(
    @Query() queries: GetManyPromotionsBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.promotionService.getManyPromotions({
      ...queries,
      processId,
      status: PromotionStatusValues.ACTIVE,
      includeUsed: false,
      userId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetPromotionResponseDto })
  async getPromotion(
    @Param() params: GetPromotionBodyDto,
    @ProcessId() processId: string
  ) {
    return this.promotionService.getPromotion({ ...params, processId });
  }
}
