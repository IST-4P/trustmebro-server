import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  GetManyProductReviewsRequestDto,
  GetManyProductReviewsResponseDto,
} from '@common/interfaces/dtos/review';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ReviewReadService } from '../services/review-read.service';

class GetManyProductReviewsBodyDto extends OmitType(
  GetManyProductReviewsRequestDto,
  ['userId', 'shopId'] as const
) {}

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewReadService: ReviewReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyProductReviewsResponseDto })
  async getManyProductReviews(
    @Query() queries: GetManyProductReviewsBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.reviewReadService.getManyProductReviews({
      ...queries,
      processId,
      rating: queries.rating ?? 5,
      shopId,
    });
  }
}
