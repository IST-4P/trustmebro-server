import { ProcessId } from '@common/decorators/process-id.decorator';
import { MessageResponseDto } from '@common/interfaces/dtos/common/response.model';
import {
  DeleteReplyRequestDto,
  GetManyProductReviewsRequestDto,
  GetManyProductReviewsResponseDto,
} from '@common/interfaces/dtos/review';
import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReplyWriteService } from '../services/reply-write.service';
import { ReviewReadService } from '../services/review-read.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(
    private readonly replyWriteService: ReplyWriteService,
    private readonly reviewReadService: ReviewReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyProductReviewsResponseDto })
  async getManyProductReviews(
    @Query() queries: GetManyProductReviewsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.reviewReadService.getManyProductReviews({
      ...queries,
      processId,
      rating: queries.rating ?? 5,
    });
  }

  @Delete()
  @ApiOkResponse({ type: MessageResponseDto })
  async deleteReply(@Query() queries: DeleteReplyRequestDto) {
    return this.replyWriteService.deleteReply({
      ...queries,
      sellerId: queries.shopId,
    });
  }
}
