import {
  Controller,
  Get,
  Headers,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PlaybackService } from '../services/playback.service';

@Controller('playback')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get('verify')
  async verifyPlayback(
    @Query() query: { videoId: string },
    @Headers('authorization') token: string
  ) {
    if (!token) {
      throw new UnauthorizedException('Error.MissingAuthorizationHeader');
    }
    return this.playbackService.verifyToken(
      token.replace('Bearer ', ''),
      query.videoId
    );
  }
}
