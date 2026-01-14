import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { GetPlaybackRequestDto } from '@common/interfaces/dtos/media';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, OmitType } from '@nestjs/swagger';
import { PlaybackService } from '../services/playback.service';

class GetPlaybackBodyDto extends OmitType(GetPlaybackRequestDto, [
  'processId',
] as const) {}

@Controller('media/playback')
@ApiTags('Media')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get()
  @IsPublic()
  async getPlayback(
    @Query() queries: GetPlaybackBodyDto,
    @ProcessId() processId: string
  ) {
    return this.playbackService.getPlayback({
      ...queries,
      processId,
    });
  }
}
