import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { GetPlaybackRequestDto } from '@common/interfaces/dtos/media';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlaybackService } from '../services/playback.service';

@Controller('media/playback')
@ApiTags('Video')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get()
  @IsPublic()
  async getPlayback(
    @Query() queries: Omit<GetPlaybackRequestDto, 'userId'>,
    @ProcessId() processId: string
  ) {
    return this.playbackService.getPlayback({
      ...queries,
      processId,
    });
  }
}
