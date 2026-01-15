import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewWriteService } from '../services/review-write.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewWriteService: ReviewWriteService) {}

  @Post()
  async createReview(@Body() body: any) {
    return this.reviewWriteService.createReview(body);
  }
}
