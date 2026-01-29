import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { GetRandomVideosRequestDto } from '@common/interfaces/dtos/media';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VideoService } from '../services/video.service';

@Controller('media/video')
@ApiTags('Media')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @IsPublic()
  async getFeed(
    @Query() queries: GetRandomVideosRequestDto,
    @ProcessId() processId: string
  ) {
    return this.videoService.getFeed({
      limit: queries.limit,
      processId,
    });
  }
}
