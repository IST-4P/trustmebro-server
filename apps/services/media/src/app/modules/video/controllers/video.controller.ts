import { ProcessVideoRequest } from '@common/interfaces/models/media';
import { Controller, Get, Query } from '@nestjs/common';
import { FfmpegService } from '../services/ffmpeg.service';

@Controller('video')
export class VideoController {
  constructor(private readonly ffmpegService: FfmpegService) {}

  @Get('download')
  async downloadVideo(@Query() query: { key: string }) {
    await this.ffmpegService.downloadVideo(query.key);
    return { message: 'Download initiated' };
  }

  @Get('process')
  async processVideo(@Query() query: ProcessVideoRequest) {
    await this.ffmpegService.processVideo(query);
    return { message: 'Processing initiated' };
  }
}
