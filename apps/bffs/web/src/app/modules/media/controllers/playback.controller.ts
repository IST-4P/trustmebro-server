import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { GetPlaybackRequestDto } from '@common/interfaces/dtos/media';
import { Controller, Get, Query } from '@nestjs/common';
import { PlaybackService } from '../services/playback.service';

@Controller('media/playback')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get()
  async getPlayback(
    @Query() queries: Omit<GetPlaybackRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.playbackService.getPlayback({
      ...queries,
      processId,
      userId,
    });
  }
}
