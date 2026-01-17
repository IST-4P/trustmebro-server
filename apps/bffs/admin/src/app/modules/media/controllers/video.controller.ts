import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyVideosRequestDto,
  GetManyVideosResponseDto,
  GetVideoRequestDto,
  GetVideoResponseDto,
} from '@common/interfaces/dtos/media';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { VideoReadService } from '../services/video-read.service';

class GetManyVideosBodyDto extends OmitType(GetManyVideosRequestDto, [
  'processId',
] as const) {}

class GetVideoBodyDto extends OmitType(GetVideoRequestDto, [
  'processId',
] as const) {}

@Controller('video')
@ApiTags('Media')
export class VideoController {
  constructor(private readonly videoReadService: VideoReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyVideosResponseDto })
  async getManyVideos(
    @Query() queries: GetManyVideosBodyDto,
    @ProcessId() processId: string
  ) {
    return this.videoReadService.getManyVideos({
      ...queries,
      processId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetVideoResponseDto })
  async getVideo(
    @Query() queries: GetVideoBodyDto,
    @ProcessId() processId: string
  ) {
    return this.videoReadService.getVideo({
      ...queries,
      processId,
    });
  }
}
