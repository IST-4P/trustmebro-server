import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { MessageResponseDto } from '@common/interfaces/dtos/common/response.model';
import {
  CreateProductReviewRequestDto,
  DeleteProductReviewRequestDto,
  GetManyProductReviewsRequestDto,
  GetManyProductReviewsResponseDto,
  ReviewResponseDto,
  UpdateProductReviewRequestDto,
} from '@common/interfaces/dtos/review';
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
import { ReviewReadService } from '../services/review-read.service';
import { ReviewWriteService } from '../services/review-write.service';

class GetManyProductReviewsBodyDto extends OmitType(
  GetManyProductReviewsRequestDto,
  ['userId', 'shopId'] as const
) {}

class GetMyReviewsBodyDto extends OmitType(GetManyProductReviewsRequestDto, [
  'productId',
  'rating',
  'userId',
] as const) {}

class UpdateProductReviewBodyDto extends OmitType(
  UpdateProductReviewRequestDto,
  ['userId'] as const
) {}

class CreateProductReviewBodyDto extends OmitType(
  CreateProductReviewRequestDto,
  ['userId'] as const
) {}

class DeleteProductReviewBodyDto extends OmitType(
  DeleteProductReviewRequestDto,
  ['userId'] as const
) {}

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(
    private readonly reviewWriteService: ReviewWriteService,
    private readonly reviewReadService: ReviewReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyProductReviewsResponseDto })
  @IsPublic()
  async getManyProductReviews(
    @Query() queries: GetManyProductReviewsBodyDto,
    @ProcessId() processId: string
  ) {
    return this.reviewReadService.getManyProductReviews({
      ...queries,
      processId,
      rating: queries.rating ?? 5,
    });
  }

  @Get('my')
  @ApiOkResponse({ type: GetManyProductReviewsResponseDto })
  async getMyReviews(
    @Query() queries: GetMyReviewsBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.reviewReadService.getManyProductReviews({
      ...queries,
      processId,
      userId,
      rating: 1, // Số nào cũng được, vì filter rating chỉ áp dụng khi có productId
    });
  }

  @Post()
  @ApiOkResponse({ type: ReviewResponseDto })
  async createReview(
    @Body() body: CreateProductReviewBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reviewWriteService.createReview({ ...body, userId });
  }

  @Put()
  @ApiOkResponse({ type: ReviewResponseDto })
  async updateReview(
    @Body() body: UpdateProductReviewBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reviewWriteService.updateReview({ ...body, userId });
  }

  @Delete(':id')
  @ApiOkResponse({ type: MessageResponseDto })
  async deleteReview(
    @Param() params: DeleteProductReviewBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reviewWriteService.deleteReview({ id: params.id, userId });
  }
}
