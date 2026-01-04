import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { PlaybackService } from '../services/playback.service';

@Controller('playback')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get('verify')
  async verifyPlayback(
    @Query() query: { videoId: string },
    @Headers('authorization') token: string,
    @Res() res: Response
  ) {
    if (!token) {
      throw new UnauthorizedException('Error.MissingAuthorizationHeader');
    }
    await this.playbackService.verifyToken(
      token.replace('Bearer ', ''),
      query.videoId
    );
    return res.status(200).send();
  }
}
