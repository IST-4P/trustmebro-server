import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreatePromotionRequestDto,
  DeletePromotionRequestDto,
  GetManyPromotionsRequestDto,
  GetManyPromotionsResponseDto,
  GetPromotionRequestDto,
  GetPromotionResponseDto,
  PromotionResponseDto,
  UpdatePromotionRequestDto,
} from '@common/interfaces/dtos/promotion';
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
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { PromotionService } from '../services/promotion.service';

class GetPromotionBodyDto extends OmitType(GetPromotionRequestDto, [
  'code',
] as const) {}

class GetManyPromotionsBodyDto extends OmitType(GetManyPromotionsRequestDto, [
  'includeUsed',
  'userId',
] as const) {}

class DeletePromotionBodyDto extends OmitType(DeletePromotionRequestDto, [
  'deletedById',
] as const) {}

@Controller('promotion')
@ApiTags('Promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get()
  @ApiOkResponse({ type: GetManyPromotionsResponseDto })
  async getManyPromotions(
    @Query() queries: GetManyPromotionsBodyDto,
    @ProcessId() processId: string
  ) {
    return this.promotionService.getManyPromotions({
      ...queries,
      processId,
      includeUsed: true,
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

  @Post()
  @ApiOkResponse({ type: PromotionResponseDto })
  async createPromotion(
    @Body() body: CreatePromotionRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.promotionService.createPromotion({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  @ApiOkResponse({ type: PromotionResponseDto })
  async updatePromotion(
    @Body() body: UpdatePromotionRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.promotionService.updatePromotion({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ type: PromotionResponseDto })
  async deletePromotion(
    @Param() params: DeletePromotionBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.promotionService.deletePromotion({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
