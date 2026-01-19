import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateProductReviewRequestDto,
  GetManyProductReviewsRequestDto,
  GetManyProductReviewsResponseDto,
} from '@common/interfaces/dtos/review';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewReadService } from '../services/review-read.service';
import { ReviewWriteService } from '../services/review-write.service';

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
    @Query() queries: GetManyProductReviewsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.reviewReadService.getManyProductReviews({
      ...queries,
      processId,
    });
  }

  @Post()
  async createReview(
    @Body() body: CreateProductReviewRequestDto,
    @UserData('userId') userId: string
  ) {
    return this.reviewWriteService.createReview({ ...body, userId });
  }
}
